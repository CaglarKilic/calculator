const MAX_DIGIT = 9
const BOARD = document.querySelector('p')
const WIDTH = BOARD.parentElement.offsetWidth * 0.97
let FLAG_DECREMENT = false
let FLAG_NEGATE = false
let FLAG_OPERATE = false

function writeDigit() {
    if (countDigits() == MAX_DIGIT) {
        return
    }

    output(readScreen() + this.textContent)
    decrementFontSize()
}

function writeNegate() {
    if (!FLAG_NEGATE) {
        output('-' + readScreen())
        decrementFontSize()
    } else {
        output(readScreen().slice(1))
        incrementFontSize()
    }

    FLAG_NEGATE = !FLAG_NEGATE
}

function clearScreen() {
    BOARD.textContent = '0'
}

function output(number) {
    let afterParse = ''
    let last = number.match(/\.$/)
    let count = number.match(/\./g)
    let lastTwo = number.match(/..$/)

    if (last && count.length == 1) { afterParse = '.' }
    if (lastTwo == '.0') { afterParse = lastTwo }

    BOARD.textContent = parseFloat(number.replace(/,/g, '')).toLocaleString('en-US', { maximumFractionDigits: 10 }) + afterParse
}

function readScreen() {
    return BOARD.textContent
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

function add(a, b) {
    return a + b
}

initButtons()

