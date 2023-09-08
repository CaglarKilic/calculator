const MAX_DIGIT = 9
const BOARD = document.querySelector('p')
const WIDTH = BOARD.parentElement.offsetWidth * 0.97
let FLAG_DECREMENT = false
let FLAG_NEGATE = false
let FLAG_OPERATE = false
let FLAG_PRECEDENCE = false
let lValue = 0
let rValue = 0
let total = 0

function writeDigit() {
    if (FLAG_OPERATE) {
        clearScreen()
        rValue = parseNumber(readScreen())
        FLAG_OPERATE = !FLAG_OPERATE
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

    if (a) {afterParse = '.'}
    if (b) {afterParse = ''}
    if (c) {afterParse = number.match(/0{1,}\.?$/)[0].replace('.', '')}

    BOARD.textContent = parseNumber(number).toLocaleString('en-US', { maximumFractionDigits: 10 }) + afterParse

    if (fontSize == 1) { decrementFontSize() } else { incrementFontSize() }
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

    //+
    document.querySelector('#add').addEventListener('click', operate)
}

function operate() {
    const mode = this.textContent

    switch (mode) {
        case '+':
            lValue = parseNumber(readScreen())
            total += lValue
            break
        case '=':

    }
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


initButtons()
