/**
 * Exemple complet d'intégration avec Microsoft Translator API
 * 
 * Pour utiliser ce code :
 * 1. Créez un compte Azure : https://azure.microsoft.com/
 * 2. Créez une ressource "Translator" dans le portail Azure
 * 3. Récupérez votre clé et région
 * 4. Remplacez les valeurs ci-dessous
 */

const MICROSOFT_TRANSLATOR_CONFIG = {
    subscriptionKey: 'VOTRE_CLE_AZURE',  // Remplacer par votre clé
    region: 'VOTRE_REGION',               // Ex: 'eastus', 'westeurope'
    endpoint: 'https://api.cognitive.microsofttranslator.com'
};

/**
 * Traduire du texte avec Microsoft Translator API
 * @param {string[]} texts - Tableau de textes à traduire
 * @param {string} targetLang - Langue cible (ex: 'zh-Hans' pour chinois simplifié)
 * @returns {Promise<string[]>} - Tableau de traductions
 */
async function translateWithMicrosoft(texts, targetLang = 'zh-Hans') {
    const url = `${MICROSOFT_TRANSLATOR_CONFIG.endpoint}/translate?api-version=3.0&to=${targetLang}`;
    
    // Préparer le corps de la requête
    const body = texts.map(text => ({ text }));
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Ocp-Apim-Subscription-Key': MICROSOFT_TRANSLATOR_CONFIG.subscriptionKey,
                'Ocp-Apim-Subscription-Region': MICROSOFT_TRANSLATOR_CONFIG.region,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Extraire les traductions
        return data.map(item => item.translations[0].text);
    } catch (error) {
        console.error('Erreur de traduction:', error);
        throw error;
    }
}

/**
 * Traduire avec détection automatique de la langue source
 */
async function translateWithAutoDetect(texts, targetLang = 'zh-Hans') {
    const url = `${MICROSOFT_TRANSLATOR_CONFIG.endpoint}/translate?api-version=3.0&to=${targetLang}`;
    
    const body = texts.map(text => ({ text }));
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Ocp-Apim-Subscription-Key': MICROSOFT_TRANSLATOR_CONFIG.subscriptionKey,
                'Ocp-Apim-Subscription-Region': MICROSOFT_TRANSLATOR_CONFIG.region,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        
        const data = await response.json();
        
        return data.map(item => ({
            translation: item.translations[0].text,
            detectedLanguage: item.detectedLanguage?.language,
            confidence: item.detectedLanguage?.score
        }));
    } catch (error) {
        console.error('Erreur:', error);
        throw error;
    }
}

/**
 * Exemple d'utilisation avec traduction par lots (plus efficace)
 */
async function batchTranslate(sentences, batchSize = 25) {
    const results = [];
    
    // Microsoft Translator accepte jusqu'à 100 éléments par requête
    // Nous utilisons 25 pour plus de sécurité
    for (let i = 0; i < sentences.length; i += batchSize) {
        const batch = sentences.slice(i, i + batchSize);
        const translations = await translateWithMicrosoft(batch);
        results.push(...translations);
        
        // Petit délai entre les lots pour éviter les limites de taux
        if (i + batchSize < sentences.length) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    }
    
    return results;
}

/**
 * Traduire avec gestion d'erreur robuste
 */
async function translateWithRetry(texts, maxRetries = 3) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            return await translateWithMicrosoft(texts);
        } catch (error) {
            console.warn(`Tentative ${attempt} échouée:`, error);
            
            if (attempt === maxRetries) {
                // Dernière tentative échouée, retourner des traductions vides
                return texts.map(() => '[Erreur de traduction]');
            }
            
            // Attendre avant de réessayer (backoff exponentiel)
            await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        }
    }
}

// Export pour utilisation dans taskpane.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        translateWithMicrosoft,
        translateWithAutoDetect,
        batchTranslate,
        translateWithRetry
    };
}

/**
 * EXEMPLE D'INTÉGRATION DANS TASKPANE.JS
 * 
 * Remplacez la fonction translateSentences() existante par :
 */

/*
async function translateSentences(sentences) {
    try {
        // Traduire par lots de 25 phrases
        const translations = await batchTranslate(sentences, 25);
        return translations;
    } catch (error) {
        console.error('Erreur de traduction:', error);
        
        // En cas d'erreur, retourner des placeholders
        return sentences.map(s => `[Traduction non disponible pour: ${s.substring(0, 20)}...]`);
    }
}
*/

/**
 * TARIFICATION MICROSOFT TRANSLATOR (Janvier 2025)
 * 
 * Niveau gratuit (F0) :
 * - 2 millions de caractères par mois gratuits
 * - Parfait pour usage personnel
 * 
 * Niveau standard (S1) :
 * - $10 USD par million de caractères
 * - Jusqu'à 250 millions de caractères/mois
 * 
 * Pour obtenir une clé gratuite :
 * 1. Allez sur https://portal.azure.com
 * 2. Créez une ressource "Translator"
 * 3. Choisissez le niveau tarifaire "F0 (gratuit)"
 * 4. Récupérez votre clé dans "Keys and Endpoint"
 */

/**
 * LANGUES SUPPORTÉES
 * 
 * Codes courants :
 * - 'zh-Hans' : Chinois simplifié
 * - 'zh-Hant' : Chinois traditionnel
 * - 'ja' : Japonais
 * - 'ko' : Coréen
 * - 'es' : Espagnol
 * - 'fr' : Français
 * - 'de' : Allemand
 * - 'it' : Italien
 * - 'pt' : Portugais
 * - 'ru' : Russe
 * 
 * Liste complète : https://learn.microsoft.com/azure/cognitive-services/translator/language-support
 */
