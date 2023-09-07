const MAX_DIGIT = 9
const BOARD = document.querySelector('p')
const WIDTH = BOARD.parentElement.offsetWidth * 0.97
let FLAG_DECREMENT = false
let FLAG_NEGATE = false
let FLAG_OPERATE = false
let lValue = 0
let rValue = 0
let total = 0

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
    let dotPrevZero = number.match(/\.0{1,}$/);
    let zero = number.match(/\..+0{1,}$/);

    if (last && count.length == 1) { afterParse = '.' }
    if (dotPrevZero) { afterParse = dotPrevZero }
    else if (zero) { afterParse = zero[0].match(/0+$/) }

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
    const mode = this.textContent

    switch (mode) {
        case '+':
            lValue = parseFloat(readScreen().replace())
    }
    if (!FLAG_OPERATE) { FLAG_OPERATE = !FLAG_OPERATE }

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

