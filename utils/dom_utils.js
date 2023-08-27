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

function addItemsToSearchList(result, value){
    while (pathOptionsCtn.firstChild) pathOptionsCtn.removeChild(pathOptionsCtn.firstChild);
    if (result.length == 0) {
        let p = document.createElement('p')
        p.textContent = 'NO se han encontrado especialidades ni temas'
        pathOptionsCtn.appendChild(p)
        return;
    }
    result.sort((a, b) => b.counter - a.counter) // Se ordenan segun cantidad de preguntas de cada Path.
    for (let path of result){
        let option = document.createElement('li')
        let pAnalogue = document.createElement('p')
        let pre = document.createTextNode('')
        let matchedSpan = document.createElement('span')
        let post = document.createTextNode('')
        matchedSpan.classList.add('highligth')
        if ('analogo' in path) {
            option.textContent = `${path.speciality} / ${path.theme}`;
            pre.textContent = `[${path.analogo.substring(0, path.analogo.indexOf(value))}`
            matchedSpan.textContent = path.analogo.substring(path.analogo.indexOf(value), path.analogo.indexOf(value) + value.length)
            post.textContent = `${path.analogo.substring(path.analogo.indexOf(value) + value.length, path.analogo.length)}] (${path.counter}) (tema)`
            pAnalogue.appendChild(pre)
            pAnalogue.appendChild(matchedSpan)
            pAnalogue.appendChild(post)
        } else if ('theme' in path) {
            if (path.theme.indexOf(value) != -1) {
                pre.textContent = `${path.speciality} / ${path.theme.substring(0, path.theme.indexOf(value))}`
                matchedSpan.textContent = path.theme.substring(path.theme.indexOf(value), path.theme.indexOf(value) + value.length)
                post.textContent = `${path.theme.substring(path.theme.indexOf(value) + value.length, path.theme.length)}`
                option.appendChild(pre)
                option.appendChild(matchedSpan)
                option.appendChild(post)
            } else {
                pre.textContent = `${path.speciality.substring(0, path.speciality.indexOf(value))}`
                matchedSpan.textContent = path.speciality.substring(path.speciality.indexOf(value), path.speciality.indexOf(value) + value.length)
                post.textContent = `${path.speciality.substring(path.speciality.indexOf(value) + value.length, path.speciality.length)} / ${path.theme}`
                option.appendChild(pre)
                option.appendChild(matchedSpan)
                option.appendChild(post)
            }
            pAnalogue.textContent = `(${path.counter}) (tema)`
        } else {
            pre.textContent = `${path.speciality.substring(0, path.speciality.indexOf(value))}`
            matchedSpan.textContent = path.speciality.substring(path.speciality.indexOf(value), path.speciality.indexOf(value) + value.length)
            post.textContent = `${path.speciality.substring(path.speciality.indexOf(value) + value.length, path.speciality.length)}`
            option.appendChild(pre)
            option.appendChild(matchedSpan)
            option.appendChild(post)
            pAnalogue.textContent = `(${path.counter}) (especialidad)`
        }
        option.id = option.textContent
        option.classList.add('path-option')
        option.setAttribute('tabindex', 0)
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

function keyDownSearcher(){
    if (pathOptionsCtn.firstChild) pathOptionsCtn.firstChild.focus()
}


export default {
    addItemsToSearchList,
    invalidateInput,
    addPath,
    validateYears,
    checkIfPathAllreadyAdded,
    clean_string_spaces,
    keyDownSearcher
}