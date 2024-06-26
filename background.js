chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "monMenuItem",
        title: "Definir l'heure d'envoi",
        contexts: ["all"]
    });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "monMenuItem") {
        // Envoyer un message à content.js
        chrome.tabs.sendMessage(tab.id, { action: 'elementClicked', id: info.selectionText });
    }
});

console.log('Service worker for background script loaded');

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('Message reçu :', message);

    if (message.action === 'timeSelected') {
        console.log(message.time, Date.now());
        const delai = message.time - Date.now();
        console.log('Délai de : ' + delai + 'ms');

        if (delai > 0) {
            setTimeout(() => {
                console.log('Envoi du message après un délai de ' + delai + 'ms');
                chrome.tabs.sendMessage(sender.tab.id, { action: 'renvoi', test: sender });
            }, delai);
        } else {
            console.warn('Le délai est négatif ou nul, le message ne sera pas envoyé.');
        }
    }
    // Envoyer une réponse immédiate pour éviter la fermeture du port
    sendResponse({ status: "message received" });
    return true; // Garder la connexion ouverte pour le sendResponse asynchrone
});



// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//     console.log(message);

//     if (message.action === 'timeSelected') {
//         const delai = message.time - Date.now();
//         console.log('Delai de : ' + delai);
//         setTimeout(() => {
//             chrome.tabs.sendMessage(sender.tab.id, { action: 'renvoi', test: sender });
//         }, delai);
//     }
// });