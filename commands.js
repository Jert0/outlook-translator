/* global Office */

Office.initialize = function (reason) {
    console.log('Commands initialized:', reason);
};

/**
 * Fonction appelée par le bouton du ruban
 */
function translateEmail(event) {
    Office.context.mailbox.item.body.getAsync(
        Office.CoercionType.Html,
        async function (result) {
            if (result.status === Office.AsyncResultStatus.Succeeded) {
                const htmlBody = result.value;
                
                try {
                    // Extraire les phrases en anglais
                    const sentences = extractEnglishSentences(htmlBody);
                    
                    if (sentences.length === 0) {
                        Office.context.mailbox.item.notificationMessages.addAsync(
                            'NoEnglishText',
                            {
                                type: Office.MailboxEnums.ItemNotificationMessageType.InformationalMessage,
                                message: 'Aucune phrase en anglais détectée dans cet email.',
                                icon: 'Icon.80x80',
                                persistent: false
                            }
                        );
                        event.completed();
                        return;
                    }
                    
                    // Traduire (utilise une simulation pour cet exemple)
                    const translations = await simulateTranslation(sentences);
                    
                    // Formater avec traductions en ligne
                    const newBody = formatInlineTranslation(htmlBody, sentences, translations);
                    
                    // Mettre à jour
                    Office.context.mailbox.item.body.setAsync(
                        newBody,
                        { coercionType: Office.CoercionType.Html },
                        function (setResult) {
                            if (setResult.status === Office.AsyncResultStatus.Succeeded) {
                                Office.context.mailbox.item.notificationMessages.addAsync(
                                    'TranslationSuccess',
                                    {
                                        type: Office.MailboxEnums.ItemNotificationMessageType.InformationalMessage,
                                        message: `Traduction ajoutée pour ${sentences.length} phrase(s) !`,
                                        icon: 'Icon.80x80',
                                        persistent: false
                                    }
                                );
                            } else {
                                Office.context.mailbox.item.notificationMessages.addAsync(
                                    'TranslationError',
                                    {
                                        type: Office.MailboxEnums.ItemNotificationMessageType.ErrorMessage,
                                        message: 'Erreur lors de la mise à jour de l\'email.',
                                        icon: 'Icon.80x80',
                                        persistent: true
                                    }
                                );
                            }
                            event.completed();
                        }
                    );
                } catch (error) {
                    Office.context.mailbox.item.notificationMessages.addAsync(
                        'TranslationError',
                        {
                            type: Office.MailboxEnums.ItemNotificationMessageType.ErrorMessage,
                            message: 'Erreur: ' + error.message,
                            icon: 'Icon.80x80',
                            persistent: true
                        }
                    );
                    event.completed();
                }
            } else {
                event.completed({ allowEvent: false });
            }
        }
    );
}

function extractEnglishSentences(content) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    const text = tempDiv.textContent || tempDiv.innerText || '';
    
    const sentences = text
        .split(/[.!?]+/)
        .map(s => s.trim())
        .filter(s => s.length > 10)
        .filter(s => {
            const latinChars = s.match(/[a-zA-Z]/g) || [];
            const totalChars = s.replace(/\s/g, '').length;
            return latinChars.length / totalChars > 0.7;
        });
    
    return sentences;
}

async function simulateTranslation(sentences) {
    // Simulation - à remplacer par un vrai appel API
    return sentences.map(s => `[中文翻译] ${s.substring(0, 30)}...`);
}

function formatInlineTranslation(originalBody, sentences, translations) {
    let newBody = originalBody;
    
    sentences.forEach((sentence, index) => {
        const translation = translations[index];
        const replacement = `${sentence}<br><span style="color: #0066cc; font-style: italic; font-size: 0.95em;">🇨🇳 ${translation}</span>`;
        newBody = newBody.replace(sentence, replacement);
    });
    
    return newBody;
}

// Enregistrer la fonction pour l'appel depuis le ruban
Office.actions.associate("translateEmail", translateEmail);
