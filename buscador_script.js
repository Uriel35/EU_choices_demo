import schema_utils from "./utils/schema_utils.js";
import dom_utils from "./dom_utils.js";

const form = document.getElementById('formulario')
const searcher = document.getElementById('search-input')
const yearsInputs = document.querySelectorAll('.year-input')
const selectAllYearsInputs = document.getElementById('select-all-years-input')
const yearsInputsCtn = document.getElementById('year-input-ctn')
const confirmPathButton = document.getElementById('confirm-path')
const pathsForm = document.getElementById('paths-form')
const deletePathButton = document.getElementById('delete-path-button')
const submitAllButton = document.getElementById('submit-form')

document.addEventListener('DOMContentLoaded', function() {
    fetch('./data/schema.json')
        .then(response => response.json())
        .then(data => {
            displayPage(data);
        })
        .catch(error => {
            console.error('Error al obtener los datos JSON:', error);
        });
});

function displayPage(data){
    const SCHEMA = data;

    yearsInputs.forEach(input => {
        input.checked = true
        input.addEventListener('change', (e) => selectAllYearsInputs.checked = false)
    })
    selectAllYearsInputs.addEventListener('change', (e) => {
        if (selectAllYearsInputs.checked) {
            yearsInputs.forEach(input => input.checked = true)
        } else yearsInputs.forEach(input => input.checked = false)
    })

    searcher.addEventListener('input', (e) => {
        if (e.target.classList.contains('error-input')) e.target.classList.remove('error-input')
        let years = dom_utils.validateYears(yearsInputs, yearsInputsCtn)
        if (years) {
            let result = schema_utils.searchInputHandler(e.target.value, SCHEMA, years);
            dom_utils.addItemsToSearchList(result)
        }
    })

    confirmPathButton.addEventListener('click', (e) => {
        e.preventDefault()
        let years = dom_utils.validateYears(yearsInputs, yearsInputsCtn)
        if (years) {
            let pathExists = schema_utils.confirmIfPathExists(searcher.value, SCHEMA)
            if (!pathExists) {
                dom_utils.invalidateInput(searcher)
                return;
            // Tal vez agregar un paso mas para ver si YA existe en el path container
            } else dom_utils.addPath(pathExists, pathsForm)
        }
    })

    deletePathButton.addEventListener('click', (e) => {
        e.preventDefault()
        const checked = document.querySelector('.path-radio:checked')
        if (checked) checked.parentElement.remove()
    })

    submitAllButton.addEventListener('click', (e) => {
        e.preventDefault()
        let years = dom_utils.validateYears(yearsInputs, yearsInputsCtn)
        if (years) {
            let paths = []
            let pathRadios = document.querySelectorAll('.path-radio')
            if (pathRadios) {
                pathRadios.forEach(radio => paths.push(radio.value))
                if (paths.length == 0) console.log('NO hay paths')
                else console.log(paths)
            }
        }
    })
}
