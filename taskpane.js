/* global Office */

Office.initialize = function (reason) {
    console.log('Office Add-in initialized:', reason);
};

// Configuration de l'API de traduction
const TRANSLATION_CONFIG = {
    // Vous pouvez utiliser différentes APIs de traduction
    // Option 1: Microsoft Translator API
    // Option 2: Google Cloud Translation API
    // Option 3: DeepL API
    // Pour cet exemple, nous utilisons une approche générique
    apiEndpoint: 'YOUR_TRANSLATION_API_ENDPOINT',
    apiKey: 'YOUR_API_KEY'
};

/**
 * Fonction principale pour traduire l'email
 */
async function translateEmail() {
    showLoading(true);
    showStatus('', '');
    
    try {
        Office.context.mailbox.item.body.getAsync(
            Office.CoercionType.Html,
            async function (result) {
                if (result.status === Office.AsyncResultStatus.Succeeded) {
                    const htmlBody = result.value;
                    const format = document.getElementById('formatSelect').value;
                    
                    // Extraire le texte en anglais
                    const sentences = extractEnglishSentences(htmlBody);
                    
                    if (sentences.length === 0) {
                        showStatus('Aucune phrase en anglais détectée.', 'info');
                        showLoading(false);
                        return;
                    }
                    
                    // Traduire les phrases
                    const translations = await translateSentences(sentences);
                    
                    // Formater le contenu avec les traductions
                    const newBody = formatTranslatedBody(htmlBody, sentences, translations, format);
                    
                    // Mettre à jour le corps de l'email
                    Office.context.mailbox.item.body.setAsync(
                        newBody,
                        { coercionType: Office.CoercionType.Html },
                        function (setResult) {
                            showLoading(false);
                            if (setResult.status === Office.AsyncResultStatus.Succeeded) {
                                showStatus('✓ Traduction ajoutée avec succès !', 'success');
                            } else {
                                showStatus('Erreur lors de la mise à jour: ' + setResult.error.message, 'error');
                            }
                        }
                    );
                } else {
                    showLoading(false);
                    showStatus('Erreur: ' + result.error.message, 'error');
                }
            }
        );
    } catch (error) {
        showLoading(false);
        showStatus('Erreur: ' + error.message, 'error');
    }
}

/**
 * Prévisualiser la traduction sans modifier l'email
 */
async function previewTranslation() {
    showLoading(true);
    showStatus('', '');
    
    try {
        Office.context.mailbox.item.body.getAsync(
            Office.CoercionType.Text,
            async function (result) {
                if (result.status === Office.AsyncResultStatus.Succeeded) {
                    const textBody = result.value;
                    const sentences = extractEnglishSentences(textBody);
                    
                    if (sentences.length === 0) {
                        showStatus('Aucune phrase en anglais détectée.', 'info');
                        showLoading(false);
                        return;
                    }
                    
                    const translations = await translateSentences(sentences.slice(0, 3)); // Prévisualiser 3 phrases
                    
                    let preview = '📝 Aperçu des 3 premières phrases:\n\n';
                    translations.forEach((trans, index) => {
                        preview += `EN: ${sentences[index]}\nCN: ${trans}\n\n`;
                    });
                    
                    showStatus(preview, 'info');
                    showLoading(false);
                } else {
                    showLoading(false);
                    showStatus('Erreur: ' + result.error.message, 'error');
                }
            }
        );
    } catch (error) {
        showLoading(false);
        showStatus('Erreur: ' + error.message, 'error');
    }
}

/**
 * Extraire les phrases en anglais du contenu
 */
function extractEnglishSentences(content) {
    // Nettoyer le HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    const text = tempDiv.textContent || tempDiv.innerText || '';
    
    // Diviser en phrases (simplifié)
    const sentences = text
        .split(/[.!?]+/)
        .map(s => s.trim())
        .filter(s => s.length > 0)
        .filter(s => isEnglish(s));
    
    return sentences;
}

/**
 * Vérifier si le texte est probablement en anglais
 */
function isEnglish(text) {
    // Vérification simple : si le texte contient principalement des caractères latins
    const latinChars = text.match(/[a-zA-Z]/g) || [];
    const totalChars = text.replace(/\s/g, '').length;
    return latinChars.length / totalChars > 0.7;
}

/**
 * Traduire un tableau de phrases
 */
async function translateSentences(sentences) {
    // IMPORTANT: Cette fonction utilise une API de traduction simulée
    // Vous devez la remplacer par un vrai appel API
    
    // Option 1: Utiliser Microsoft Translator API
    return await translateWithMicrosoftAPI(sentences);
    
    // Option 2: Utiliser une autre API de traduction
    // return await translateWithCustomAPI(sentences);
}

/**
 * Traduction avec Microsoft Translator API
 */
async function translateWithMicrosoftAPI(sentences) {
    const translations = [];
    
    for (const sentence of sentences) {
        try {
            // Exemple d'appel à Microsoft Translator API
            // Vous devez avoir une clé API valide
            const response = await fetch(
                'https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&to=zh-Hans',
                {
                    method: 'POST',
                    headers: {
                        'Ocp-Apim-Subscription-Key': TRANSLATION_CONFIG.apiKey,
                        'Ocp-Apim-Subscription-Region': 'YOUR_REGION',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify([{ text: sentence }])
                }
            );
            
            const data = await response.json();
            const translation = data[0].translations[0].text;
            translations.push(translation);
        } catch (error) {
            console.error('Erreur de traduction:', error);
            // En cas d'erreur, ajouter une traduction d'exemple
            translations.push(`[Traduction de: ${sentence.substring(0, 30)}...]`);
        }
    }
    
    return translations;
}

/**
 * Alternative: Traduction locale simulée (pour les tests)
 */
async function simulateTranslation(sentences) {
    // Ceci est uniquement pour les tests - remplacez par une vraie API
    return sentences.map(s => `[翻译] ${s}`);
}

/**
 * Formater le corps avec les traductions
 */
function formatTranslatedBody(originalBody, sentences, translations, format) {
    let newBody = originalBody;
    
    switch (format) {
        case 'inline':
            // Ajouter la traduction après chaque phrase
            sentences.forEach((sentence, index) => {
                const translation = translations[index];
                const replacement = `${sentence}<br><span style="color: #666; font-style: italic;">${translation}</span>`;
                newBody = newBody.replace(sentence, replacement);
            });
            break;
            
        case 'block':
            // Ajouter toutes les traductions à la fin
            let translationBlock = '<hr><div style="margin-top: 20px; padding: 15px; background-color: #f9f9f9; border-left: 4px solid #0078d4;">';
            translationBlock += '<h3 style="color: #0078d4; margin-top: 0;">中文翻译 (Chinese Translation)</h3>';
            sentences.forEach((sentence, index) => {
                translationBlock += `<p><strong>EN:</strong> ${sentence}</p>`;
                translationBlock += `<p><strong>CN:</strong> ${translations[index]}</p>`;
                translationBlock += '<br>';
            });
            translationBlock += '</div>';
            newBody += translationBlock;
            break;
            
        case 'dual':
            // Format tableau bilingue
            let dualTable = '<hr><table style="width: 100%; border-collapse: collapse; margin-top: 20px;">';
            dualTable += '<thead><tr><th style="border: 1px solid #ddd; padding: 10px; background-color: #0078d4; color: white;">English</th>';
            dualTable += '<th style="border: 1px solid #ddd; padding: 10px; background-color: #0078d4; color: white;">中文</th></tr></thead><tbody>';
            sentences.forEach((sentence, index) => {
                dualTable += `<tr>`;
                dualTable += `<td style="border: 1px solid #ddd; padding: 10px;">${sentence}</td>`;
                dualTable += `<td style="border: 1px solid #ddd; padding: 10px;">${translations[index]}</td>`;
                dualTable += `</tr>`;
            });
            dualTable += '</tbody></table>';
            newBody += dualTable;
            break;
    }
    
    return newBody;
}

/**
 * Afficher/masquer le chargement
 */
function showLoading(show) {
    const loading = document.querySelector('.loading');
    if (loading) {
        loading.style.display = show ? 'block' : 'none';
    }
}

/**
 * Afficher un message de statut
 */
function showStatus(message, type) {
    const statusDiv = document.getElementById('status');
    if (statusDiv) {
        if (message) {
            statusDiv.textContent = message;
            statusDiv.className = 'status ' + type;
            statusDiv.style.display = 'block';
            
            // Masquer automatiquement après 5 secondes pour les succès
            if (type === 'success') {
                setTimeout(() => {
                    statusDiv.style.display = 'none';
                }, 5000);
            }
        } else {
            statusDiv.style.display = 'none';
        }
    }
}

// Exposer les fonctions globalement
window.translateEmail = translateEmail;
window.previewTranslation = previewTranslation;
