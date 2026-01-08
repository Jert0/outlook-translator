# Extension Outlook - Traducteur EN → CN

## 📋 Description

Cette extension Outlook vous permet d'ajouter automatiquement des traductions en chinois simplifié à vos emails en anglais lors de la rédaction de réponses.

## ✨ Fonctionnalités

- **Traduction automatique** : Traduit les phrases anglaises en chinois simplifié
- **Plusieurs formats** :
  - **En ligne** : Traduction après chaque phrase
  - **En bloc** : Toutes les traductions à la fin
  - **Bilingue** : Tableau comparatif côte à côte
- **Prévisualisation** : Aperçu avant d'appliquer les traductions
- **Bouton dans le ruban** : Accès rapide pendant la rédaction

## 🔧 Installation

### Prérequis

1. **Outlook Desktop** (Windows ou Mac) ou **Outlook sur le web**
2. **Un serveur web HTTPS** pour héberger les fichiers
3. **Une clé API de traduction** (Microsoft Translator, Google Translate, ou DeepL)

### Étapes d'installation

#### 1. Configurer l'API de traduction

Ouvrez le fichier `taskpane.js` et configurez votre API :

```javascript
const TRANSLATION_CONFIG = {
    apiEndpoint: 'VOTRE_ENDPOINT_API',
    apiKey: 'VOTRE_CLE_API'
};
```

**Options d'API de traduction :**

##### Option A : Microsoft Translator API (Recommandé)

1. Créez un compte Azure : https://azure.microsoft.com/
2. Créez une ressource "Translator" dans le portail Azure
3. Récupérez votre clé API et région
4. Utilisez l'endpoint : `https://api.cognitive.microsofttranslator.com/translate`

##### Option B : Google Cloud Translation API

1. Créez un projet sur Google Cloud Console
2. Activez l'API Cloud Translation
3. Créez des identifiants API
4. Utilisez l'endpoint : `https://translation.googleapis.com/language/translate/v2`

##### Option C : DeepL API

1. Inscrivez-vous sur https://www.deepl.com/pro-api
2. Récupérez votre clé API
3. Utilisez l'endpoint : `https://api-free.deepl.com/v2/translate` (gratuit) ou `https://api.deepl.com/v2/translate` (pro)

#### 2. Héberger les fichiers

Les fichiers doivent être hébergés sur un serveur HTTPS :

**Structure des fichiers :**
```
/
├── manifest.xml
├── taskpane.html
├── taskpane.js
├── commands.html
├── commands.js
└── assets/
    ├── icon-16.png
    ├── icon-32.png
    └── icon-80.png
```

**Options d'hébergement :**
- Azure Static Web Apps (gratuit)
- GitHub Pages (gratuit, nécessite un repo public)
- Netlify (gratuit)
- Vercel (gratuit)
- Votre propre serveur web

**Exemple avec GitHub Pages :**

```bash
# Créez un nouveau dépôt sur GitHub
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/VOTRE-USERNAME/outlook-translator.git
git push -u origin main

# Activez GitHub Pages dans les paramètres du dépôt
# Votre URL sera : https://VOTRE-USERNAME.github.io/outlook-translator/
```

#### 3. Mettre à jour le manifeste

Dans `manifest.xml`, remplacez `https://votre-serveur.com` par votre URL réelle :

```xml
<bt:Url id="Commands.Url" DefaultValue="https://VOTRE-URL/commands.html" />
<bt:Url id="Taskpane.Url" DefaultValue="https://VOTRE-URL/taskpane.html" />
```

#### 4. Créer les icônes

Créez trois icônes PNG :
- `icon-16.png` : 16x16 pixels
- `icon-32.png` : 32x32 pixels
- `icon-80.png` : 80x80 pixels

Vous pouvez utiliser un emoji de traduction (🌐) ou créer vos propres icônes.

#### 5. Installer l'extension dans Outlook

**Pour Outlook Desktop (Windows/Mac) :**

1. Ouvrez Outlook
2. Allez dans **Fichier** > **Obtenir des compléments**
3. Cliquez sur **Mes compléments** dans la barre latérale
4. Faites défiler vers le bas et cliquez sur **+ Ajouter un complément personnalisé** > **Ajouter depuis un fichier**
5. Sélectionnez votre fichier `manifest.xml`
6. Cliquez sur **Installer**

**Pour Outlook sur le web :**

1. Connectez-vous à Outlook sur le web
2. Cliquez sur l'icône des paramètres (⚙️) > **Afficher tous les paramètres d'Outlook**
3. Allez dans **Général** > **Gérer les compléments**
4. Cliquez sur **+ Ajouter un complément personnalisé**
5. Sélectionnez **Ajouter depuis un fichier**
6. Téléchargez votre `manifest.xml`

## 📖 Utilisation

### Méthode 1 : Bouton du ruban (Rapide)

1. Composez ou répondez à un email en anglais
2. Cliquez sur le bouton **"Traduire EN→CN"** dans le ruban
3. Les traductions sont automatiquement ajoutées

### Méthode 2 : Panneau de contrôle (Plus d'options)

1. Composez ou répondez à un email en anglais
2. Cliquez sur **"Panneau Traduction"** dans le ruban
3. Choisissez votre format de traduction :
   - **En ligne** : Traduction après chaque phrase
   - **En bloc** : Toutes les traductions regroupées à la fin
   - **Bilingue** : Tableau avec colonnes EN et CN
4. Cliquez sur **"Prévisualiser"** pour voir un aperçu (optionnel)
5. Cliquez sur **"Ajouter traduction chinoise"** pour appliquer

## 🎨 Exemples de formats

### Format "En ligne"
```
Hello, how are you today?
你好，你今天好吗？

I hope this email finds you well.
希望你收到这封邮件时一切都好。
```

### Format "En bloc"
```
[Votre email en anglais]

─────────────────────
中文翻译 (Chinese Translation)
─────────────────────

EN: Hello, how are you today?
CN: 你好，你今天好吗？

EN: I hope this email finds you well.
CN: 希望你收到这封邮件时一切都好。
```

### Format "Bilingue"
```
┌────────────────────────────────┬────────────────────────────────┐
│ English                        │ 中文                            │
├────────────────────────────────┼────────────────────────────────┤
│ Hello, how are you today?      │ 你好，你今天好吗？               │
│ I hope this email finds you... │ 希望你收到这封邮件时一切都好...   │
└────────────────────────────────┴────────────────────────────────┘
```

## 🔧 Personnalisation

### Modifier le style des traductions

Dans `taskpane.js`, vous pouvez personnaliser le style CSS des traductions :

```javascript
// Pour le format "en ligne"
const replacement = `${sentence}<br><span style="color: #0066cc; font-style: italic; background-color: #f0f8ff; padding: 2px 4px; border-radius: 3px;">${translation}</span>`;
```

### Ajouter d'autres langues

Pour ajouter d'autres paires de langues, modifiez le sélecteur dans `taskpane.html` :

```html
<select id="targetLanguage">
    <option value="zh-Hans">Chinois simplifié</option>
    <option value="zh-Hant">Chinois traditionnel</option>
    <option value="ja">Japonais</option>
    <option value="ko">Coréen</option>
</select>
```

## 🐛 Dépannage

### L'extension n'apparaît pas dans Outlook

- Vérifiez que le fichier `manifest.xml` est valide
- Assurez-vous que toutes les URLs dans le manifeste sont HTTPS
- Redémarrez Outlook

### Les traductions ne fonctionnent pas

- Vérifiez votre clé API dans `taskpane.js`
- Ouvrez la console de développement (F12) pour voir les erreurs
- Vérifiez que votre API a des crédits disponibles

### "Aucune phrase en anglais détectée"

- L'extension détecte uniquement les phrases avec plus de 70% de caractères latins
- Assurez-vous que votre email contient du texte en anglais
- Vérifiez que les phrases se terminent par `.`, `!` ou `?`

## 💰 Coûts

### APIs de traduction

- **Microsoft Translator** : 2 millions de caractères gratuits/mois, puis ~$10/million
- **Google Translate** : $20/million de caractères
- **DeepL** : 500 000 caractères gratuits/mois, puis à partir de €5,49/mois

### Hébergement

- **GitHub Pages** : Gratuit
- **Netlify** : Gratuit pour usage personnel
- **Vercel** : Gratuit pour usage personnel
- **Azure Static Web Apps** : Gratuit pour 100 Go de bande passante/mois

## 🔒 Sécurité

⚠️ **Important** :
- Ne partagez jamais votre clé API publiquement
- Utilisez un fichier `.env` ou des variables d'environnement pour les clés
- Pour un usage professionnel, créez un backend qui gère les appels API

**Exemple de backend simple (Node.js) :**

```javascript
// server.js
const express = require('express');
const app = express();

app.post('/translate', async (req, res) => {
    // Votre clé API est stockée côté serveur
    const apiKey = process.env.TRANSLATOR_API_KEY;
    
    // Appelez l'API de traduction
    // ...
    
    res.json({ translation: result });
});

app.listen(3000);
```

## 📝 Licence

Ce projet est fourni à titre d'exemple. Vous êtes libre de le modifier et de l'utiliser selon vos besoins.

## 🤝 Support

Pour toute question ou problème :
1. Vérifiez d'abord ce guide
2. Consultez la documentation officielle d'Outlook Add-ins : https://learn.microsoft.com/office/dev/add-ins/
3. Vérifiez la documentation de votre API de traduction

## 📚 Ressources

- [Documentation Outlook Add-ins](https://learn.microsoft.com/office/dev/add-ins/outlook/)
- [Microsoft Translator API](https://azure.microsoft.com/services/cognitive-services/translator/)
- [Office.js API Reference](https://learn.microsoft.com/javascript/api/office)
- [GitHub - Exemples Office Add-ins](https://github.com/OfficeDev/Office-Add-in-samples)
