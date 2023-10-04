const PROMPT = document.querySelector('p')
const MAX_DIGIT = 9
let buffer = ''
let opBuffer = []
let numBuffer = []
const arith = {
    '+': (a, b) => a + b,
    '\u{2010}': (a, b) => a - b,
    '*': (a, b) => a * b,
    '/': (a, b) => a / b
}

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

    //minus sign
    let minusSign = document.querySelector('#negate')
    minusSign.addEventListener('focusin', addRemoveMinusSign)
    minusSign.addEventListener('click', addRemoveMinusSign)

    //equal sign
    document.querySelector('#equal').addEventListener('click', equate)

    //AC
    document.querySelector('#ac').addEventListener('click', flush)
}

// UTILITY

function read() {
    return buffer || '0'
}

function write(input) {
    PROMPT.textContent = input
}

function flush(mode='buffer') {
    buffer = ''
    if (mode != 'buffer') {
        numBuffer = []
        opBuffer = []
        write(0)
    }
}

function countDigits(number, part = 'all') {
    if (part == 'decimal') { return number.split('.')[1].length }
    return number.match(/\d/g).length
}

function parseInput(input) {
    return parseFloat(input.match(/[^,]/g).join(''))
}

function writeBuffer(input) {
    let float = parseInput(input)
    if (input.includes('.') && !input.includes('e')) { float = float.toFixed(countDigits(input, 'decimal')) }
    buffer = toLocal(float)
}

function toLocal(input) {
    let options = countDigits(input.toString()) > MAX_DIGIT ? { notation: 'scientific' } : {}
    return input.toLocaleString('en-US', options)
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

function getLastOp() {
    let lastop = opBuffer[opBuffer.length - 1]
    if (lastop) {
        return [...document.querySelectorAll('.op')].filter((button) => button.textContent == lastop).pop()
    }
}

function calc(mode = 'r', startIndex = 0) {
    let lvalue = mode == 'w' ? numBuffer.splice(startIndex, 1)[0] : numBuffer[startIndex]
    let rvalue = mode == 'w' ? numBuffer.splice(startIndex, 1)[0] : numBuffer[startIndex + 1]
    let op = mode == 'w' ? opBuffer.splice(startIndex, 1)[0] : opBuffer[startIndex]

    let result = arith[op](lvalue, rvalue)

    if (mode == 'w') { startIndex ? numBuffer.push(result) : numBuffer.unshift(result) }

    return result
}


// INPUT

function addDigit() {
    let input = read()
    if (countDigits(input) == MAX_DIGIT) { return }
    writeBuffer(input + this.textContent)
    write(buffer)
}

function addDecimal() {
    let input = read()
    if (countDigits(input) == MAX_DIGIT || input.includes('.')) { return }
    buffer = input + this.textContent
    write(buffer)
}

function addRemoveMinusSign(event) {
    if (event.type == 'focusin') {
        let op = getLastOp()
        if (op && !buffer) { op.focus() }
        return
    }

    let input = read()
    buffer = input[0] == '-' ? input.replace('-', '') : '-' + input
    write(buffer)
}

// OPERATION

function operate() {
    if (this.textContent) { registerBuffers(this.textContent) }

    if (opBuffer.length == 2) {
        if (opBuffer[0].match(/[\*\/]/)) { write(calc('w')) }
        else if (opBuffer[1].match(/[\*\/]/)) { write(numBuffer[1]) }
        else { write(calc()) }
    }

    if (opBuffer.length == 3) {
        if (opBuffer[1].match(/[\*\/]/)) { write(calc('w', 1)) }
        else { write(calc('w')) }
        operate()
    }
}

function equate() {

}


init()