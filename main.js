const PROMPT = document.querySelector('p')
const MAX_DIGIT = 9
let buffer = ''
let opBuffer = []
let numBuffer = []

function init() {
    // ------- Buttons -------

    //numbers
    for (button of document.querySelectorAll('.number')) {
        button.addEventListener('click', addDigit)
    }

    //decimal
    document.querySelector('#decimal').addEventListener('click', addDecimal)

    //operators
    document.querySelector('#add').addEventListener('click', operate)
    document.querySelector('#divide').addEventListener('click', operate)
    document.querySelector('#subtract').addEventListener('click', operate)
    document.querySelector('#multiply').addEventListener('click', operate)
}

// UTILITY

function read() {
    return buffer || '0'
}

function write(input) {
    PROMPT.textContent = input
}

function flush() {
    buffer = ''
}

function countDigits(number, part = 'all') {
    if (part == 'decimal') { return number.split('.')[1].length }
    return number.match(/\d/g).length
}

function parseInput(input) {
    return parseFloat(input.match(/[^,]/g).join(''))
}

function clearInput() {
    if (this.textContent) { }
    writeInput('0')
}

function writeInput(input) {
    let options = countDigits(input) > MAX_DIGIT ? { notation: 'scientific' } : {}
    let float = parseInput(input)
    if (input.includes('.') && !input.includes('e')) { float = float.toFixed(countDigits(input, 'decimal')) }
    buffer = float.toLocaleString('en-US', options)
}

function registerBuffers(op) {
    if (buffer) {
        numBuffer.push(parseInput(buffer))
        flush()
    }

    if (numBuffer.length > opBuffer.length) { opBuffer.push(op) }
    else {
        opBuffer.pop()
        opBuffer.push(op)
    }
}


// INPUT

function addDigit() {
    let input = read()
    if (countDigits(input) == MAX_DIGIT) { return }
    writeInput(input + this.textContent)
    write(buffer)
}

function addDecimal() {
    let input = read()
    if (countDigits(input) == MAX_DIGIT || input.includes('.')) { return }
    buffer = input + this.textContent
    write(buffer)
}


// OPERATION

function operate() {
    registerBuffers(this.textContent)
}


init()