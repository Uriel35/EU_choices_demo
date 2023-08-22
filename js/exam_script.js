const examModal = document.getElementById('exam-modal')
const questionCtn = document.getElementById('question-ctn') 
const optionsCtn = document.getElementById('options-ctn') 
const circlesCtn = document.getElementById('circles-ctn') 
const ciclesModal = document.getElementById('circle-modal')
const circlesModalCtn = document.getElementById('circles-modal-ctn')
const nextButton = document.getElementById('next-btn') 
const previousButton = document.getElementById('previous-btn') 
const correctMarker = document.getElementById('correct-marker')
const errorMarker = document.getElementById('error-marker')
const totalMarker = document.getElementById('total-marker')
const remakeButton = document.getElementById('remake-q-btn')
const questionImageButtonCtn = document.getElementById('img-button-ctn')
const questionImageButton = document.getElementById('display-img-modal-button')
const imageModal = document.getElementById('img-modal')
const questionImage = document.getElementById('question-img')
const closeImageModalButton = document.getElementById('img-modal-close-button')
const questionOriginText = document.getElementById('origin-text')
const getBackButton = document.getElementById('get-back-button')
const questionErrorMessage = document.getElementById('question-error-message')

function displayExam(allQuestions) {
    while (circlesCtn.firstChild) circlesCtn.removeChild(circlesCtn.firstChild)
    while (circlesModalCtn.firstChild) circlesModalCtn.removeChild(circlesModalCtn.firstChild)
    examModal.classList.add('modal-active')

    function manageCounter(counter, nextBool){
        if (nextBool == true && counter < PREGUNTAS.length - 1) {
            return counter + 1
        }
        else if (nextBool == true && counter == PREGUNTAS.length - 1){
            return 0
        }
        else if (nextBool == false && counter > 0){
            return counter - 1
        }
        else if (nextBool == false && counter == 0){
            return PREGUNTAS.length - 1
        }
    }

    function showQuestion(index, disable, choosen=undefined){
        let indexNum = index + 1
        questionCtn.textContent = ''
        optionsCtn.textContent = ''
        questionCtn.textContent = `${PREGUNTAS[index]['custom-index']}) ${PREGUNTAS[index]['question']}`
        questionOriginText.textContent = `Examen unico ${PREGUNTAS[index]['origin']['exam']}, pregunta ${PREGUNTAS[index]['index']}), tema 'A'`

        if (PREGUNTAS[index]['image'] == '') {
            if (questionImageButtonCtn.classList.contains('flex-active')) questionImageButtonCtn.classList.remove('flex-active')
        } else {
            questionImageButtonCtn.classList.add('flex-active')
            questionImage.setAttribute('src', `img/${PREGUNTAS[index]['image']}.png`)
        }
        
        for (let letter of ['a', 'b', 'c', 'd']){
            let option = document.createElement('div')
            option.className = 'option'
            option.id = letter
            option.textContent = `${letter}) ${PREGUNTAS[index]['options'][letter]}`
            function optionClickHandler(e) {
                e.preventDefault()
                doneQuestions.push({
                    'index': indexNum,
                    'choosen': e.target.id,
                    'correct': PREGUNTAS[index]['answer'].toLowerCase()
                })
                if (PREGUNTAS[index]['answer'].toLowerCase() == e.target.id){
                    e.target.classList.add('option-correct')
                    document.getElementById(indexNum).classList.add('circle-correct')
                    document.getElementById(`modal-${indexNum}`).classList.add('circle-correct')
                    customMarker(true)
                }
                else {
                    e.target.classList.add('option-error');
                    document.getElementById(PREGUNTAS[index]['answer'].toLowerCase()).classList.add('option-correct');
                    document.getElementById(`${indexNum}`).classList.add('circle-error');
                    document.getElementById(`modal-${indexNum}`).classList.add('circle-error')
                    customMarker(false)
                }
                createBlackOut()
            }
            option.addEventListener('touchstart', optionClickHandler) // Para la version 'Mobile'
            option.addEventListener('click', optionClickHandler)
            optionsCtn.appendChild(option)
        }
        questionErrorMessage.textContent = ''
        if (PREGUNTAS[index]['answer'] == 'invalid') {
            createBlackOut('Pregunta oficialmente invalidada')
        } else if (!['a', 'b', 'c', 'd', 'invalid'].includes(PREGUNTAS[index]['answer'])) {
            createBlackOut('Pregunta incompleta')
        }
        if (disable) {
            createBlackOut()
            document.getElementById(PREGUNTAS[index]['answer'].toLowerCase()).classList.add('option-correct')
            if (PREGUNTAS[index]['answer'].toLowerCase() !== choosen) document.getElementById(choosen).classList.add('option-error')
        }
    }

    function customMarker(correctBool, reset=false) {
        if (reset) {
            correctMarker.textContent = CORRECTAS
            errorMarker.textContent = ERRORES
            totalMarker.textContent = TOTAL
            return;
        }
        if (correctBool) {
            CORRECTAS++
            correctMarker.textContent = CORRECTAS
        } else {
            ERRORES++
            errorMarker.textContent = ERRORES
        }
        TOTAL++
        totalMarker.textContent = TOTAL
    }

    function createBlackOut(message=undefined){
            const optionBlackOut = document.createElement('div')
            optionBlackOut.className = 'option-blackout'
            optionsCtn.appendChild(optionBlackOut)
            if (message) questionErrorMessage.textContent = message
            else questionErrorMessage.textContent = ""
    }
    
    function removeBlackOut(){
        const divEliminar = document.querySelector('.option-blackout');
        divEliminar.remove();
    }

    function checkIfDonned(index){
        let indexNum = index + 1
        let finded = doneQuestions.find((object) => {
            return object.index == indexNum
        })
        if (finded) {
            if (finded.correct == finded.choosen) showQuestion(index, true, finded.choosen)
            else showQuestion(index, true, finded.choosen)
        } else showQuestion(index, false)
    }
    let customCounter = 1
    allQuestions = allQuestions.map(q => {
        q['custom-index'] = customCounter
        customCounter++
        return q
    })

    let TOTAL = 0
    let CORRECTAS = 0
    let ERRORES = 0
    const PREGUNTAS = allQuestions
    let doneQuestions = []
    let counter = 0

    for (let i = 1; i <= PREGUNTAS.length; i++) {
        const CIRCLE = document.createElement('div');
        CIRCLE.classList.add('circle-neutral-ctn');
        CIRCLE.id = i
        CIRCLE.textContent = i;
        CIRCLE.addEventListener('click', (e) => {
            counter = parseInt(e.target.id) - 1
            checkIfDonned(counter)
        })
        circlesCtn.appendChild(CIRCLE);

        const MODAL_CIRCLE = document.createElement('div')
        MODAL_CIRCLE.classList.add('circle-neutral-ctn');
        MODAL_CIRCLE.id = `modal-${i}`
        MODAL_CIRCLE.textContent = i;
        MODAL_CIRCLE.addEventListener('click', (e) => {
            counter = parseInt(e.target.textContent) - 1
            checkIfDonned(counter)
            ciclesModal.classList.remove('flex-active')
        })
        circlesModalCtn.appendChild(MODAL_CIRCLE);
    }
    customMarker(undefined, true)

    showQuestion(counter, false)

    function nextQuestionHandler(e){
        e.stopPropagation()
        counter = manageCounter(counter, true)
        checkIfDonned(counter)
    }

    function previousQuestionHandler(e){
        e.stopPropagation()
        counter = manageCounter(counter, false)
        checkIfDonned(counter)
    }

    // const examCtn = document.querySelector('.questions-ctn')
    // console.log(examCtn)

    nextButton.addEventListener('click', nextQuestionHandler)
    // examModal.addEventListener("keydown", (e) => { if (e.key == 'ArrowRigth') nextQuestionHandler(e)})
    document.addEventListener('keydown', (e) => {
        if (e.key == 'ArrowLeft') previousQuestionHandler(e)
        else if (e.key == 'ArrowRight') nextQuestionHandler(e)
    })
    previousButton.addEventListener('click', previousQuestionHandler)
    // examModal.addEventListener("keydown", (e) => { if (e.key == 'ArrowLeft') previousQuestionHandler(e)})
    remakeButton.addEventListener('click', () => {
        let indexNum = counter + 1
        let finded = doneQuestions.find((object) => {
            return object.index == indexNum
        })
        if (finded) {
            if (finded.correct == finded.choosen) {
                if (CORRECTAS > 0) CORRECTAS--
                correctMarker.textContent = CORRECTAS
            } else {
                if (ERRORES > 0) ERRORES--
                errorMarker.textContent = ERRORES
            }
            TOTAL--
            totalMarker.textContent = TOTAL
            removeBlackOut()
            document.getElementById(indexNum).className = 'circle-neutral-ctn'
            document.querySelectorAll('.option-error').forEach(elemento => elemento.classList.remove('option-error'));
            document.querySelectorAll('.option-correct').forEach(elemento => elemento.classList.remove('option-correct'));
        } 
        doneQuestions = doneQuestions.filter((e) => e.index != indexNum)
    })
}

getBackButton.addEventListener('click', () => {
    if (examModal.classList.contains('modal-active')) {
        examModal.classList.remove('modal-active')
    }
})

questionImageButton.addEventListener('click', (e) => {
    imageModal.classList.add('flex-active')
})

closeImageModalButton.addEventListener('click', (e) => {
    imageModal.classList.remove('flex-active')
})

imageModal.addEventListener('click', (e) => {
    e.preventDefault()
    if (e.target !== questionImage) imageModal.classList.remove('flex-active')
})


export default {
    displayExam
}