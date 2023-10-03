const PROMPT = document.querySelector('p')
const MAX_DIGIT = 9

function init() {
    // ------- Buttons -------

    //numbers
    for (button of document.querySelectorAll('.number')) {
        button.addEventListener('click', addDigit)
    }

    //decimal
    document.querySelector('#decimal').addEventListener('click', addDecimal)
}

// UTILITY

function readInput() {
    return PROMPT.textContent
}

function countDigits(number, part = 'all') {
    if (part == 'decimal') { return number.split('.')[1].length }
    return number.match(/\d/g).length
}


// INPUT

function addDigit() {
    let input = readInput()
    if (countDigits(input) == MAX_DIGIT) { return }
    writeInput(input + this.textContent)
}

function addDecimal() {
    let input = readInput()
    if (countDigits(input) == MAX_DIGIT || input.includes('.')) { return }
    PROMPT.textContent = input + this.textContent
}

function writeInput(input) {
    let options = countDigits(input) > MAX_DIGIT ? { notation: 'scientific' } : {}
    let float = parseFloat(input.match(/[^,]/g).join(''))
    if (input.includes('.') && !input.includes('e')) { float = float.toFixed(countDigits(input, 'decimal')) }
    PROMPT.textContent = float.toLocaleString('en-US', options)
}


init()