
// je stocke l'id de l'element sur lequel l'utilisateur a ouvert le menu contextuel
document.addEventListener('contextmenu', function (event) {
    // event.preventDefault();
    // Vérifier si l'élément cliqué a un ID
    if (event.target.id) {
        // Stocker l'ID de l'élément cliqué dans chrome.storage.local
        sessionStorage.setItem('clickedElementId', event.target.id);
    }
});

// ecouteur de messages
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'elementClicked') {
        console.log(message, sender, sendResponse);
        createPopup();
    }
    if (message.action === 'renvoi') {
        const elemClicked = sessionStorage.getItem('clickedElementId');
        document.querySelector('#' + elemClicked).click();
        console.log("L'element : " + elemClicked + "A été cliqué!");
    }
});


// creation de popup
function createPopup() {
    // Créer une div pour la popup
    const popup = document.createElement('div');
    popup.id = 'heureEnvoi';
    popup.classList.add('popupHeureEnvoi');

    // Ajouter un titre à la popup
    const title = document.createElement('h2');
    title.innerText = 'Definir une heure';
    title.style.margin = '0 0 10px 0';
    popup.appendChild(title);

    // Ajouter un paragraphe à la popup
    const paragraph = document.createElement('p');
    paragraph.innerText = 'Choissisez une date et une heure.';
    popup.appendChild(paragraph);
    const inputContainer = createInputContainer();
    popup.appendChild(inputContainer);

    // Ajouter un bouton pour fermer la popup
    const closeButton = document.createElement('button');
    closeButton.classList.add('btn-definir-action');
    closeButton.innerText = 'Envoyer';
    closeButton.addEventListener('click', () => {
        sauvegarderAction();

    });
    popup.appendChild(closeButton);

    // Ajouter la popup au corps du document
    document.body.appendChild(popup);
}

function sauvegarderAction() {
    let date = document.querySelector('#inputDate').value;
    let time = document.querySelector('#inputTime').value;
    console.log(date, time);
    const timestamp = convertTimeToTimestamp(date + ' ' + time);
    console.log(timestamp);
    document.body.removeChild(popup);
    console.log(timestamp - (Date.now() / 1000));

    chrome.runtime.sendMessage({ action: 'timeSelected', time: timestamp }, response => {
        if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError.message);
        } else {
            console.log('Message envoyé :', response);
        }
    });
}


function createInputContainer() {
    const inputContainer = document.createElement('div');
    inputContainer.classList.add('input-container');

    inputContainer.appendChild(createChampDate());
    inputContainer.appendChild(createChampTime());

    return inputContainer;
}


function createChampDate() {
    const inputDate = document.createElement('input');
    inputDate.type = "date";
    inputDate.id = "inputDate";
    inputDate.classList.add('input-date-envoi');

    return inputDate;

}

function createChampTime() {
    const inputTime = document.createElement('input');
    inputTime.type = "time";
    inputTime.id = "inputTime";
    inputTime.step = '1';
    inputTime.classList.add('input-time-envoi');

    return inputTime;
}

function convertTimeToTimestamp(dateEnString) {
    const isoDateString = dateEnString.replace(' ', 'T');

    // Créer un objet Date
    const date = new Date(isoDateString);

    // Obtenir le timestamp en millisecondes
    const timestamp = date.getTime();

    return timestamp;
}