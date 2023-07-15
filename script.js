const questionCtn = document.getElementById('question-ctn') 
const optionsCtn = document.getElementById('options-ctn') 
const circlesCtn = document.getElementById('circles-ctn') 
const nextButton = document.getElementById('next-btn') 
const previousButton = document.getElementById('previous-btn') 
const correctMarker = document.getElementById('correct-marker')
const errorMarker = document.getElementById('error-marker')
const totalMarker = document.getElementById('total-marker')

document.addEventListener('DOMContentLoaded', function() {
    fetch('./data.json')
        .then(response => response.json())
        .then(data => {
            function manageCounter(counter, nextBool){
                if (nextBool == true && counter < 99) {
                    return counter + 1
                }
                else if (nextBool == true && counter == 99){
                    return 0
                }
                else if (nextBool == false && counter > 0){
                    return counter - 1
                }
                else if (nextBool == false && counter == 0){
                    return 99
                }
            }

            function showQuestion(index, disable, choosen=undefined){
                indexNum = index + 1
                indexStr = index.toString()
                questionCtn.textContent = ''
                optionsCtn.textContent = ''
                questionCtn.textContent = `${PREGUNTAS[index]['index']}) ${PREGUNTAS[index]['question']}`
                
                for (letter of ['a', 'b', 'c', 'd']){
                    option = document.createElement('div')
                    option.className = 'option'
                    option.id = letter
                    option.textContent = `${letter}) ${PREGUNTAS[index]['options'][letter]}`
                    option.addEventListener('click', (e) => {
                        id = e.target.id
                        console.log(doneQuestions)
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
                    console.log("Choosen", choosen)
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

            function checkIfDonned(index){
                indexNum = index + 1
                let finded = doneQuestions.find((object) => {
                    return object.index == indexNum
                })
                if (finded) {
                    if (finded.correct == finded.choosen) showQuestion(index, true, choosen=finded.choosen)
                    else showQuestion(index, true, choosen=finded.choosen)
                } else showQuestion(index, false)
            }

            let TOTAL = 0
            let CORRECTAS = 0
            let ERRORES = 0
            const PREGUNTAS = data['examen_unico']['2023']
            let doneQuestions = []
            let counter = 0

            for (let i = 1; i <= 100; i++) {
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

            showQuestion(counter, disable=false)

            nextButton.addEventListener('click', (e) => {
                e.stopPropagation()
                counter = manageCounter(counter, true)
                checkIfDonned(counter)
                // showQuestion(counter, false)
            })
            previousButton.addEventListener('click', (e) => {
                e.stopPropagation()
                counter = manageCounter(counter, false)
                checkIfDonned(counter)
                // showQuestion(counter, false)
            })


        })

        .catch(error => {
        console.error('Error al obtener los datos JSON:', error);
        });
});



// const preguntasContainer = document.getElementById('preguntas-container');
// const submitBtn = document.getElementById('submit-btn');


// const container = document.getElementById('container');

// const circleContainer = document.getElementById('circle_container');



// preguntas.forEach((pregunta, q_index) => {
//     const preguntaDiv = document.createElement('div');
//     const opcionesContainer = document.createElement('div');
//     opcionesContainer.className = 'opciones-ctn'
//     preguntaDiv.className = 'pregunta';
//     preguntaDiv.innerHTML = `<h3>${pregunta['index']}) ${pregunta['question']}</h3>`;

//     letters_array = ['a', 'b', 'c', 'd']
//     for (let index in letters_array) {
//         const respuestaDiv = document.createElement('div');
//         respuestaDiv.className = 'opcion';

//         const input = document.createElement('input');
//         input.type = 'radio';
//         input.name = `${q_index}`;
//         input.value = letters_array[index];
//         input.id = `${q_index}-${letters_array[index]}`

//         const label = document.createElement('label');
//         label.setAttribute('for', `${q_index}-${letters_array[index]}`) 
//         label.innerHTML = `${letters_array[index]}) ${pregunta.options[letters_array[index]]}`;

//         respuestaDiv.appendChild(input);
//         respuestaDiv.appendChild(label);

//         opcionesContainer.appendChild(respuestaDiv);
//         preguntaDiv.appendChild(opcionesContainer)
//     }
//     preguntasContainer.appendChild(preguntaDiv);
// });

// submitBtn.addEventListener('click', () => {
//     const respuestas = [];

//     const preguntasDivs = preguntasContainer.getElementsByClassName('pregunta');
//     Array.from(preguntasDivs).forEach((preguntaDiv, index) => {
//         const respuestaInput = preguntaDiv.querySelector('input:checked');
//         if (respuestaInput) {
//             const respuesta = {
//                 pregunta: preguntas[index],
//                 respuesta: respuestaInput.value
//             };
//             respuestas.push(respuesta);
//         }
//     });

//         // Haz algo con las respuestas (por ejemplo, enviarlas al servidor)
//         // console.log(respuestas);
// });
