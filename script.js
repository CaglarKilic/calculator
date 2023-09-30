const MAX_DIGIT = 9
const BOARD = document.querySelector('p')
const WIDTH = BOARD.parentElement.offsetWidth * 0.97
let FLAG_DECREMENT = false
let FLAG_NEGATE = false
let FLAG_OPERATE = false
let exp = ''
const arithmetic = {
    '+': (a, b) => a + b,
    '-': (a, b) => a - b,
    '*': (a, b) => a * b,
    '/': (a, b) => a / b
}


function writeDigit() {
    if (FLAG_OPERATE) {
        clearScreen()
        FLAG_OPERATE = false
    }

    if (countDigits() == MAX_DIGIT) { return }

    output(readScreen() + this.textContent)
}


function writeNegate() {
    if (!FLAG_NEGATE) {
        output('-' + readScreen())
    } else {
        output(readScreen().slice(1), 0)
    }

    FLAG_NEGATE = !FLAG_NEGATE
}


function clearScreen() {
    BOARD.textContent = '0'
}


function output(number, fontSize = 1) {
    let afterParse = ''
    let a = number.match(/\.\.?$/)
    let b = number.match(/\..+\.$/)
    let c = number.match(/\..*0{1,}\.?$/)

    if (a) { afterParse = '.' }
    if (b) { afterParse = '' }
    if (c) { afterParse = number.match(/0{1,}\.?$/)[0].replace('.', '') }

    BOARD.textContent = parseNumber(number).toLocaleString('en-US', { maximumFractionDigits: 8 }) + afterParse

    if (fontSize == 1) { decrementFontSize() } else { incrementFontSize() }

    return parseNumber(readScreen())
}


function readScreen() {
    return BOARD.textContent
}


function parseNumber(nString) {
    return parseFloat(nString.replace(/,/g, ''))
}


function initButtons() {
    //Numbers
    let numbers = document.querySelectorAll('.number')
    numbers.forEach(number => {
        number.addEventListener('click', writeDigit)
    })

    //Negate 
    document.querySelector('#negate').addEventListener('click', writeNegate)

    //AC
    document.querySelector('#ac').addEventListener('click', clearScreen)

    //op
    document.querySelector('#add').addEventListener('click', operate)
    document.querySelector('#divide').addEventListener('click', operate)
    document.querySelector('#subtract').addEventListener('click', operate)
    document.querySelector('#multiply').addEventListener('click', operate)
    document.querySelector('#equal').addEventListener('click', operate)
}


function operate() {
    if (!FLAG_OPERATE) { exp = exp + parseNumber(readScreen()) }
    FLAG_OPERATE = true
    exp = (exp.match(/\d$/)) ? (exp + this.textContent) : (exp.replace(/.$/, this.textContent))// add or replace operator
    let result = evalExp()
    console.log(exp)
    output(result + '')
}


function countDigits() {
    return readScreen().replace(/[,\.\-]/g, '').length
}


function getFontSize(element) {
    return parseInt(window.getComputedStyle(element).fontSize)
}


function decrementFontSize() {
    while (BOARD.offsetWidth > WIDTH) {
        let size = getFontSize(BOARD) - 1
        BOARD.style.fontSize = size + 'px'
        FLAG_DECREMENT = true
    }
}


function incrementFontSize() {
    if (FLAG_DECREMENT) {
        while (BOARD.offsetWidth < WIDTH - 5) {
            let size = getFontSize(BOARD) + 1
            BOARD.style.fontSize = size + 'px'
        }
        FLAG_DECREMENT = false
    }
}


function evalExp() {
    let ops = exp.match(/[\*\/\+\-=]/g)
    let len = ops.length

    if (len < 2) { return parseFloat(exp) }

    if (len == 2) {
        if (ops[0].match(/[\*\/]/) || ops[1] == '=') {
            let result = calculate(exp.slice(0, -1), 1)
            return result
        }

        if (ops[1].match(/[\*\/]/)) {
            return parseFloat(exp.match(/[\d\.]+(?=.$)/))
        }

        if (ops[1].match(/[\+\-]/)) {
            let result = calculate(exp.slice(0, -1))
            return result
        }
    }

    if (len == 3) {
        if (ops[1].match(/[\*\/]/)) {
            calculate(exp.match(/[\d\.]+[\*\/][\d\.]+/)[0], 1)
            return evalExp()
        }

        if (ops[2].match(/[\*\/]/)) {
            calculate(exp.match(/[\d\.]+.[\d\.]+/)[0], 1)
            return evalExp()
        }
    }
}


function calculate(atom, reduce = 0) {
    console.log(atom)
    let sep = /[^\d\.]/
    let values = atom.split(sep).map(parseFloat)
    let operator = atom.match(sep)[0]

    let result = arithmetic[operator](values[0], values[1])
    if (reduce) { reduceExp(atom, result.toString()) }

    return result
}


function reduceExp(atom, result) {
    exp = exp.replace(atom, result)
}


initButtons()
