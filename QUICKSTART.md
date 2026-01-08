# 🚀 Guide de Démarrage Rapide

## Installation en 5 minutes

### Étape 1 : Obtenir une clé API (2 min)

**Option la plus simple : Microsoft Translator (gratuit)**

1. Allez sur https://portal.azure.com
2. Créez un compte gratuit si vous n'en avez pas
3. Cliquez sur "Créer une ressource"
4. Recherchez "Translator" et cliquez sur "Créer"
5. Remplissez le formulaire :
   - **Niveau tarifaire** : F0 (gratuit - 2M caractères/mois)
   - **Région** : Choisissez la plus proche (ex: West Europe)
6. Cliquez sur "Examiner + créer" puis "Créer"
7. Une fois créé, allez dans la ressource et cliquez sur "Clés et points de terminaison"
8. Copiez la **Clé 1** et la **Région**

### Étape 2 : Héberger les fichiers (2 min)

**Option la plus simple : GitHub Pages**

```bash
# Dans le dossier outlook-translation-addin
git init
git add .
git commit -m "Initial commit"

# Créez un nouveau dépôt sur GitHub (public)
# Puis :
git remote add origin https://github.com/VOTRE-USERNAME/outlook-translator.git
git push -u origin main
```

Dans GitHub :
1. Allez dans **Settings** > **Pages**
2. Source : **Deploy from a branch**
3. Branch : **main** / **root**
4. Cliquez sur **Save**
5. Votre URL sera : `https://VOTRE-USERNAME.github.io/outlook-translator/`

### Étape 3 : Configuration (1 min)

#### A. Modifier manifest.xml

Remplacez toutes les occurrences de `https://votre-serveur.com` par votre URL GitHub Pages :

```xml
<!-- Exemple -->
<bt:Url id="Commands.Url" DefaultValue="https://VOTRE-USERNAME.github.io/outlook-translator/commands.html" />
<bt:Url id="Taskpane.Url" DefaultValue="https://VOTRE-USERNAME.github.io/outlook-translator/taskpane.html" />
```

Également pour les images :
```xml
<bt:Image id="Icon.16x16" DefaultValue="https://VOTRE-USERNAME.github.io/outlook-translator/assets/icon-16.png"/>
```

#### B. Modifier taskpane.js

Ligne 6-10, ajoutez votre clé API :

```javascript
const TRANSLATION_CONFIG = {
    apiEndpoint: 'https://api.cognitive.microsofttranslator.com/translate?api-version=3.0',
    apiKey: 'VOTRE_CLE_COPIEE_DEPUIS_AZURE',
    region: 'VOTRE_REGION'  // Ex: 'westeurope'
};
```

Et remplacez la fonction `translateWithMicrosoftAPI` (ligne ~120) pour qu'elle utilise vraiment l'API :

```javascript
async function translateWithMicrosoftAPI(sentences) {
    const translations = [];
    
    // Traduire par lots de 25 pour plus d'efficacité
    const batchSize = 25;
    
    for (let i = 0; i < sentences.length; i += batchSize) {
        const batch = sentences.slice(i, i + batchSize);
        const body = batch.map(text => ({ text }));
        
        try {
            const response = await fetch(
                'https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&to=zh-Hans',
                {
                    method: 'POST',
                    headers: {
                        'Ocp-Apim-Subscription-Key': TRANSLATION_CONFIG.apiKey,
                        'Ocp-Apim-Subscription-Region': TRANSLATION_CONFIG.region,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(body)
                }
            );
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            const data = await response.json();
            const batchTranslations = data.map(item => item.translations[0].text);
            translations.push(...batchTranslations);
            
        } catch (error) {
            console.error('Erreur de traduction:', error);
            // En cas d'erreur, ajouter des placeholders
            batch.forEach(s => translations.push(`[Erreur: ${s.substring(0, 20)}...]`));
        }
        
        // Petit délai entre les lots
        if (i + batchSize < sentences.length) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    }
    
    return translations;
}
```

#### C. Créer les icônes

Créez un dossier `assets` et ajoutez 3 images :
- `icon-16.png` (16x16 pixels)
- `icon-32.png` (32x32 pixels)  
- `icon-80.png` (80x80 pixels)

**Astuce** : Utilisez un emoji 🌐 converti en PNG ou créez simplement des carrés bleus avec du texte "EN→CN".

Outil en ligne gratuit : https://www.favicon-generator.org/

### Étape 4 : Pousser les modifications

```bash
git add .
git commit -m "Configuration de l'API"
git push
```

Attendez 1-2 minutes que GitHub Pages se mette à jour.

### Étape 5 : Installer dans Outlook

#### Outlook Desktop (Windows/Mac)

1. Ouvrez Outlook
2. **Fichier** > **Obtenir des compléments** (ou **Get Add-ins**)
3. Cliquez sur **Mes compléments**
4. En bas : **+ Ajouter un complément personnalisé** > **Ajouter depuis un fichier**
5. Sélectionnez le fichier `manifest.xml` (celui que vous venez de modifier)
6. Acceptez l'avertissement
7. L'extension est installée !

#### Outlook Web

1. Allez sur https://outlook.office.com
2. Cliquez sur l'icône ⚙️ (Paramètres)
3. **Afficher tous les paramètres d'Outlook**
4. **Général** > **Gérer les compléments**
5. **+ Ajouter un complément personnalisé**
6. Copiez-collez le contenu de votre `manifest.xml`
7. Ou uploadez le fichier directement

## ✅ Vérification

1. Créez un nouveau message ou répondez à un email
2. Vous devriez voir un nouveau groupe "Traduction CN" dans le ruban
3. Tapez quelques phrases en anglais :
   ```
   Hello, how are you?
   I hope this message finds you well.
   Looking forward to your response.
   ```
4. Cliquez sur **"Traduire EN→CN"**
5. Les traductions devraient apparaître ! 🎉

## 🐛 Problèmes courants

### "L'extension ne s'affiche pas"
- Vérifiez que toutes les URLs dans `manifest.xml` sont en HTTPS
- Redémarrez Outlook
- Vérifiez que GitHub Pages est bien actif (visitez l'URL dans un navigateur)

### "Erreur de traduction"
- Vérifiez votre clé API dans `taskpane.js`
- Ouvrez la console (F12) pour voir les erreurs détaillées
- Vérifiez que vous n'avez pas dépassé le quota gratuit (2M caractères/mois)

### "Impossible de charger l'extension"
- Assurez-vous que tous les fichiers sont bien poussés sur GitHub
- Vérifiez que les chemins des fichiers dans `manifest.xml` sont corrects
- Les icônes doivent exister dans le dossier `assets/`

### "Aucune phrase en anglais détectée"
- L'extension cherche des phrases avec au moins 70% de caractères latins
- Assurez-vous d'avoir des phrases complètes avec ponctuation (. ! ?)

## 📞 Support

Si vous rencontrez des problèmes :

1. Vérifiez la console du navigateur (F12) pour les erreurs
2. Vérifiez les logs Azure pour voir si l'API est appelée
3. Testez votre clé API avec curl :

```bash
curl -X POST "https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&to=zh-Hans" \
-H "Ocp-Apim-Subscription-Key: VOTRE_CLE" \
-H "Ocp-Apim-Subscription-Region: VOTRE_REGION" \
-H "Content-Type: application/json" \
-d "[{'Text':'Hello'}]"
```

## 🎓 Prochaines étapes

Une fois que ça fonctionne, vous pouvez :
- Ajouter d'autres langues (voir le fichier README.md)
- Personnaliser le style des traductions
- Ajouter plus de formats d'affichage
- Créer un backend pour sécuriser votre clé API

Bon courage ! 🚀
