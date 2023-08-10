const pathOptionsCtn = document.getElementById('matched-search-list')

function clean_string_spaces(value){
    value = value.replace(/^\s+/, '')
    value = value.replace(/\s+$/, '')
    value = value.replace(/\s+{2, }/, ' ')
    value = value.replace(/(\s+)?\/(\s+)?/, '/')
    value = value.toLowerCase()
    return value
}

function deleteBracketsAndParentesis(value) {
  const regex = /\[[^\]]*\]|\([^)]*\)/g;
  value = value.replace(regex, '')
  value = clean_string_spaces(value)
  return value
}

function addItemsToSearchList(result){
    while (pathOptionsCtn.firstChild) pathOptionsCtn.removeChild(pathOptionsCtn.firstChild);

    result.sort((a, b) => b.counter - a.counter) // Se ordenan segun cantidad de preguntas de cada Path.
    for (let path of result){
        let option = document.createElement('li')
        let pAnalogue = document.createElement('p')
        if ('analogo' in path) {
            option.textContent = `${path.speciality} / ${path.theme}`;
            pAnalogue.textContent = `[${path.analogo}] (${path.counter}) (tema)`
        } else if ('theme' in path) {
            option.textContent = `${path.speciality} / ${path.theme}`;
            pAnalogue.textContent = `(${path.counter}) (tema)`
        } else {
            option.textContent = `${path.speciality}`;
            pAnalogue.textContent = `(${path.counter}) (especialidad)`
        }
        option.id = option.textContent
        option.classList.add('path-option')
        option.appendChild(pAnalogue)
        pathOptionsCtn.appendChild(option)
    }
}

function invalidateInput(input, message=undefined){
    input.blur()
    input.classList.add('error-input')
    if (message) {
        input.nextElementSibling.textContent = message
    }
}

function validateYears(yearsInputs, yearsInputsCtn){
    let yearsInputsValues = []
    yearsInputs.forEach(yearInput => {
        if (yearInput.checked) yearsInputsValues.push(yearInput.value);
    })
    if (yearsInputsValues.length == 0) {
        yearsInputs.forEach(yearInput => yearsInputsValues.push(yearInput.value))
        if (yearsInputsCtn.classList.contains('error-input')) yearsInputsCtn.classList.remove('error-input')
    } else {
        if (yearsInputsCtn.classList.contains('error-input')) yearsInputsCtn.classList.remove('error-input')
    }
    return yearsInputsValues
}

function checkIfPathAllreadyAdded(value, formCtn) {
    let labels = formCtn.getElementsByTagName('label')
    for (let label of labels){
        if (label.textContent.toLowerCase() == value.toLowerCase()){
            return true
        }
    }
    return false
}

function addPath(value, formCtn, resetQuestionCounterFx) {
    let ctn = document.createElement('div')
    ctn.className = 'path-ctn'
    let radio = document.createElement('input')
    let trash = document.createElement('i')
    trash.className = 'fas fa-trash'
    radio.type = 'radio'
    radio.id = value
    radio.name = 'path-radio-inputs'
    radio.className = 'path-radio'
    radio.value = value
    let label = document.createElement('label')
    label.textContent = value
    label.htmlFor = value
    ctn.appendChild(radio)
    ctn.appendChild(label)
    ctn.appendChild(trash)
    formCtn.appendChild(ctn)
    trash.addEventListener('click', (e) => {
        ctn.remove()
        resetQuestionCounterFx()
    })
}


export default {
    addItemsToSearchList,
    invalidateInput,
    addPath,
    validateYears,
    checkIfPathAllreadyAdded,
    clean_string_spaces
}