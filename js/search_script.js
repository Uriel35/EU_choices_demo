import schema_utils from "../utils/schema_utils.js";
import dom_utils from "../utils/dom_utils.js";
import exam_script from "./exam_script.js";

const searcher = document.getElementById('search-input')
const matchedSearchList = document.getElementById('matched-search-list')
const yearsInputs = document.querySelectorAll('.year-input')
const selectAllYearsInputs = document.getElementById('select-all-years-input')
const yearsInputsCtn = document.getElementById('year-input-ctn')
const searchForm = document.getElementById('formulario')
const pathsForm = document.getElementById('paths-form')
const submitAllButton = document.getElementById('submit-form')
const cleanAllPathsButton = document.getElementById('clean-all-paths-button')
const shuffleButton = document.getElementById('random-input')
const allQuestionsCounter = document.getElementById('all-q-counter')

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
    function setAllQuestionCounter() {
        let years = dom_utils.validateYears(yearsInputs, yearsInputsCtn)
        if (years) {
            let allQuestions = []
            let paths = []
            let pathRadios = document.querySelectorAll('.path-radio')
            if (pathRadios) {
                pathRadios.forEach(radio => paths.push(dom_utils.clean_string_spaces(radio.value)))
                for (let path of paths) {
                    if (!schema_utils.confirmIfPathExists(path, SCHEMA)){
                        return;
                    }
                }
                allQuestions = schema_utils.getQuestions(paths, SCHEMA, years)
                allQuestionsCounter.textContent = `${allQuestions.length} preguntas`
            } else allQuestionsCounter.textContent = '800 preguntas'
        }
    }

    const SCHEMA = data;

    yearsInputs.forEach(input => {
        input.checked = true
        input.addEventListener('change', (e) => {
            selectAllYearsInputs.checked = false
            setAllQuestionCounter()
        })
    })
    selectAllYearsInputs.addEventListener('change', (e) => {
        if (selectAllYearsInputs.checked) {
            yearsInputs.forEach(input => input.checked = true)
        } else yearsInputs.forEach(input => input.checked = false)
        setAllQuestionCounter()
    })

    document.addEventListener('click', (event) => {
        // Para que cada vez que hacemos focus out del searcher desaparezca la lista
        if (!matchedSearchList.contains(event.target) && event.target !== searcher) {
            matchedSearchList.classList.remove('flex-active')
        }
    });

    function searchHandler(e) {
        matchedSearchList.classList.add('flex-active')
        if (e.target.classList.contains('error-input')) e.target.classList.remove('error-input')

        let years = dom_utils.validateYears(yearsInputs, yearsInputsCtn)
        let result = schema_utils.searchInputHandler(e.target.value, SCHEMA, years);
        dom_utils.addItemsToSearchList(result)
        const allPathOptions = document.querySelectorAll('.path-option')
        allPathOptions.forEach(pathOption => {
            pathOption.addEventListener('click', (e) => {
                searcher.value = pathOption.id
                submitSearchInput(e) // Creo que seria mejor intentar que se active el 'submit' event de searchForm
                setAllQuestionCounter()
            })
        })
    }
    searcher.addEventListener('focusin', searchHandler)
    searcher.addEventListener('input', searchHandler)

    function submitSearchInput(e) {
        e.preventDefault()
        searcher.focus() // Focusear siempre el input
        matchedSearchList.classList.remove('flex-active') // Remover la lista de path-option
        let pathExists = schema_utils.confirmIfPathExists(searcher.value, SCHEMA)
        if (!pathExists) {
            dom_utils.invalidateInput(searcher, 'Especialidad y/o tema NO existente')
            return;
        } else {
            let allreadyAdded = dom_utils.checkIfPathAllreadyAdded(pathExists, pathsForm)
            if (!allreadyAdded) {
                dom_utils.addPath(pathExists, pathsForm, setAllQuestionCounter)
            } else {
                dom_utils.invalidateInput(searcher, 'Especialidad y/o tema ya agregado')
            }
        }
        setAllQuestionCounter()
        searcher.value = ''
    }

    searchForm.addEventListener('submit', submitSearchInput)

    cleanAllPathsButton.addEventListener('click', (e) => {
        while (pathsForm.firstChild) pathsForm.removeChild(pathsForm.firstChild);
        setAllQuestionCounter()
    })

    submitAllButton.addEventListener('click', (e) => {
        let years = dom_utils.validateYears(yearsInputs, yearsInputsCtn)
        let allQuestions = []
        let paths = []
        let pathRadios = document.querySelectorAll('.path-radio')
        if (pathRadios) {
            pathRadios.forEach(radio => paths.push(dom_utils.clean_string_spaces(radio.value)))
            for (let path of paths) {
                if (!schema_utils.confirmIfPathExists(path, SCHEMA)) return;
            }
            allQuestions = schema_utils.getQuestions(paths, SCHEMA, years)
        } else allQuestions = schema_utils.getQuestions([], SCHEMA, years)

        if (allQuestions.length == 0) {
            let errorModal = document.getElementById('error-modal')
            errorModal.classList.add('flex-active')
            errorModal.querySelector('p').textContent = 'NO hay preguntas sobre esos temas'
            return;
        }

        if (shuffleButton.checked) allQuestions.sort(() => Math.random() - 0.5)

        exam_script.displayExam(allQuestions)
    })

    setAllQuestionCounter()
}
