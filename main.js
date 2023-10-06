const PROMPT = document.querySelector('p')
const MAX_DIGIT = 9
let buffer = ''
let mem = null
let lastop = null
let opBuffer = []
let numBuffer = []
const arith = {
    '+': (a, b) => a + b,
    '-': (a, b) => a - b,
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
    return buffer
}

function write(input) {
    PROMPT.textContent = input
}

function flush(mode = 'buffer') {
    buffer = ''
    if (mode != 'buffer') {
        numBuffer = []
        opBuffer = []
        mem = null
        lastop = null
        write(0)
    }
}

function countDigits(number) {
    const parts = number.split('.').map((part) => part.length)
    return {
        decimal: parts[1] || 0,
        integer: parts[0],
        all: parts[0] + (parts[1] || 0)
    }
}

function checkPrecedence(sign) {
    return sign.match(/[\*\/]/)
}

function parseInput(input) {
    return parseFloat(input.match(/[^,]/g).join(''))
}

function format(input) {
    const number = parseFloat(input)
    const digitCounts = countDigits(input)
    const fixed = number.toFixed(MAX_DIGIT - 1).replace(/0*$/, '')
    const endDot = input.match(/\.$/) == null ? '' : '.'

    if (digitCounts.all <= MAX_DIGIT) {
        return number.toLocaleString('en-US', {minimumFractionDigits: digitCounts.decimal}) + endDot
    }
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

function reduce(mode = 'r', startIndex = 0) {
    const lvalue = mode == 'w' ? numBuffer.splice(startIndex, 1)[0] : numBuffer[startIndex]
    const rvalue = mode == 'w' ? numBuffer.splice(startIndex, 1)[0] : numBuffer[startIndex + 1]
    const op = mode == 'w' ? opBuffer.splice(startIndex, 1)[0] : opBuffer[startIndex]

    const result = arith[op](lvalue, rvalue)

    if (mode == 'w') { startIndex ? numBuffer.push(result) : numBuffer.unshift(result) }

    return result
}


// INPUT

function addDigit() {
    let input = read()
    if (countDigits(input) == MAX_DIGIT) { return }
    buffer = input + this.textContent
    write(format(buffer))
}

function addDecimal() {
    let input = read()
    if (countDigits(input) == MAX_DIGIT || input.includes('.')) { return }
    buffer = input + this.textContent
    write(format(buffer))
}

function addRemoveMinusSign(event) {
    if (event.type == 'focusin') {
        if (lastop && !buffer) { lastop.focus() }
        return
    }

    let input = read() || '0'
    buffer = input[0] == '-' ? input.replace('-', '') : '-' + input
    write(buffer)
}

// OPERATION

function operate() {
    if (this.textContent) {
        mem = null
        lastop = this
        registerBuffers(this.textContent)
    }

    if (opBuffer.length == 1 && numBuffer.length == 2) { write(reduce('w')) } // only helps function `equate`

    if (numBuffer.length == 2) {
        if (checkPrecedence(opBuffer[0])) { write(reduce('w')) }
        else if (checkPrecedence(opBuffer[1])) { write(numBuffer[1]) }
        else { write(reduce()) }
    }

    if (numBuffer.length == 3) {
        if (checkPrecedence(opBuffer[1])) { write(reduce('w', 1)) }
        else { write(reduce('w')) }
        operate()
    }
}

function equate() {
    if (mem != null) {
        write(buffer = arith[lastop.textContent](parseInput(PROMPT.textContent), mem).toString())
        return
    }

    mem = parseInput(PROMPT.textContent)
    numBuffer.push(mem)

    if (opBuffer.length > 0) {
        operate()
    }

    buffer = numBuffer.pop().toString()
}


init()