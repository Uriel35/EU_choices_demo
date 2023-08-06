
fetch('./data/readme.txt') 
    .then(response => response.text())
    .then(content => {
        const outputElement = document.getElementById('readme-output');
        outputElement.textContent = content;
    })
    .catch(error => {
        console.error('Error al obtener el archivo:', error);
});

// fetch('./data/helpme.txt') 
//     .then(response => response.text())
//     .then(content => {
//         const outputElement = document.getElementById('help-me-output');
//         content = content.replace(/\n/g, '<br>');
//         outputElement.innerHTML = content;
//     })
//     .catch(error => {
//         console.error('Error al obtener el archivo:', error);
// });

function defineModal(openButton=undefined, modal, ctn) {
    if (openButton) openButton.addEventListener('click', () => modal.classList.add('flex-active'))
    modal.addEventListener('click', (e) => {
        if (e.target.contains(ctn)) modal.classList.remove('flex-active')
    })
}


defineModal(document.getElementById('readme-button'), document.getElementById('readme-modal'), document.getElementById('readme-ctn'))
// defineModal(document.getElementById('help-me-button'), document.getElementById('help-me-modal'), document.getElementById('help-me-ctn'))
defineModal(undefined, document.getElementById('error-modal'), document.getElementById('error-modal-ctn'))