const suggestionsPathsDataList = document.getElementById('path-suggestions')

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
    while (suggestionsPathsDataList.firstChild) suggestionsPathsDataList.removeChild(suggestionsPathsDataList.firstChild);
    for (let path of result){
        let option = document.createElement('option')
        if ('analogo' in path) {
            option.value = `${path.speciality}/${path.theme}`;
            option.textContent = `[${path.analogo}] (${path.counter})`
        } else if ('theme' in path) {
            option.value = `${path.speciality}/${path.theme}`;
            option.textContent = `(${path.counter})`
        } else {
            option.value = `${path.speciality}`;
            option.textContent = `(${path.counter})`
        }
        suggestionsPathsDataList.appendChild(option)
    }
}

function invalidateInput(input){
    input.blur()
    input.classList.add('error-input')
}

function validateYears(yearsInputs, yearsInputsCtn){
    let yearsInputsValues = []
    yearsInputs.forEach(yearInput => {
        if (yearInput.checked) yearsInputsValues.push(yearInput.value);
    })
    if (yearsInputsValues.length == 0) {
        invalidateInput(yearsInputsCtn)
        return false;
    } else {
        if (yearsInputsCtn.classList.contains('error-input')) yearsInputsCtn.classList.remove('error-input')
        return yearsInputsValues
    }
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

function addPath(value, formCtn) {
    let ctn = document.createElement('div')
    ctn.className = 'path-ctn'
    let radio = document.createElement('input')
    radio.type = 'radio'
    radio.id = value
    radio.name = 'path-radio-inputs'
    radio.className = 'path-radio'
    radio.value = value
    let label = document.createElement('label')
    label.tabIndex = 0
    label.textContent = value
    label.htmlFor = value
    ctn.appendChild(radio)
    ctn.appendChild(label)
    formCtn.appendChild(ctn)
}

export default {
    addItemsToSearchList,
    invalidateInput,
    addPath,
    validateYears,
    checkIfPathAllreadyAdded
}