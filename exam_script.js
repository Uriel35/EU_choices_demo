const examModal = document.getElementById('exam-modal')
const questionCtn = document.getElementById('question-ctn') 
const optionsCtn = document.getElementById('options-ctn') 
const circlesCtn = document.getElementById('circles-ctn') 
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

function displayExam(allQuestions) {
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
        let indexStr = index.toString()
        questionCtn.textContent = ''
        optionsCtn.textContent = ''
        questionCtn.textContent = `${PREGUNTAS[index]['custom-index']}) ${PREGUNTAS[index]['question']}`
        questionOriginText.textContent = `Examen unico ${PREGUNTAS[index]['origin']['exam']}, pregunta ${PREGUNTAS[index]['index']})`

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
            option.addEventListener('click', (e) => {
                let id = e.target.id
                doneQuestions.push({
                    'index': indexNum,
                    'choosen': e.target.id,
                    'correct': PREGUNTAS[index]['answer'].toLowerCase()
                })
                if (PREGUNTAS[index]['answer'].toLowerCase() == e.target.id){
                    e.target.classList.add('option-correct')
                    document.getElementById(indexNum).classList.add('circle-correct')
                    customMarker(true)
                }
                else {
                    e.target.classList.add('option-error')
                    document.getElementById(PREGUNTAS[index]['answer'].toLowerCase()).classList.add('option-correct')
                    document.getElementById(`${indexNum}`).classList.add('circle-error')
                    customMarker(false)
                }
                createBlackOut()
            })
            optionsCtn.appendChild(option)
        } 
        if (disable) {
            createBlackOut()
            document.getElementById(PREGUNTAS[index]['answer'].toLowerCase()).classList.add('option-correct')
            if (PREGUNTAS[index]['answer'].toLowerCase() !== choosen) document.getElementById(choosen).classList.add('option-error')
        }
    }

    function customMarker(correctBool) {
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

    function createBlackOut(){
            const optionBlackOut = document.createElement('div')
            optionBlackOut.className = 'option-blackout'
            optionsCtn.appendChild(optionBlackOut)
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
    }

    showQuestion(counter, false)

    nextButton.addEventListener('click', (e) => {
        e.stopPropagation()
        counter = manageCounter(counter, true)
        checkIfDonned(counter)
    })
    previousButton.addEventListener('click', (e) => {
        e.stopPropagation()
        counter = manageCounter(counter, false)
        checkIfDonned(counter)
    })
    remakeButton.addEventListener('click', () => {
        let indexNum = counter + 1
        let finded = doneQuestions.find((object) => {
            return object.index == indexNum
        })
        if (finded) {
            if (finded.correct == finded.choosen) {
                if (CORRECTAS > 0) CORRECTAS--
                console.log(CORRECTAS)
                correctMarker.textContent = CORRECTAS
            } else {
                if (ERRORES > 0) ERRORES--
                console.log(ERRORES)
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
    console.log(e.target)
    // console.log(questionImage)
    // console.log(e.target.contains(questionImage))
    console.log(e.target == questionImage)

    if (e.target !== questionImage) {
        console.log("Se deberia cerrar el modal")
        imageModal.classList.remove('flex-active')
    }
    console.log("------------------")
})


export default {
    displayExam
}