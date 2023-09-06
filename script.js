const MAX_DIGIT = 9
const BOARD = document.querySelector('p')
const WIDTH = BOARD.parentElement.offsetWidth * 0.97
let FLAG_DECREMENT = false
let FLAG_DECIMAL = false
let FLAG_NEGATE = false

function writeDigit() {
    if (countDigits() == MAX_DIGIT) {
        return
    }

    let prompt = BOARD.textContent + this.textContent
    BOARD.textContent = parseFloat(prompt.replace(/,/g, '')).toLocaleString('en-US', { maximumFractionDigits: 10 })
    console.log(BOARD.offsetWidth, WIDTH)
    decrementFontSize()
    console.log(BOARD.offsetWidth, WIDTH)
}

function writeDecimal() {
    if ((countDigits() == MAX_DIGIT) || FLAG_DECIMAL) {
        return
    }

    BOARD.textContent += this.textContent
    FLAG_DECIMAL = true
    decrementFontSize()
}

function writeNegate() {
    if (!FLAG_NEGATE) {
        BOARD.textContent = '-' + BOARD.textContent
        decrementFontSize()
    } else {
        BOARD.textContent = BOARD.textContent.slice(1)
        incrementFontSize()
    }

    FLAG_NEGATE = !FLAG_NEGATE
}

function initButtons() {
    //Numbers
    let numbers = document.querySelectorAll('.number')
    numbers.forEach(number => {
        number.addEventListener('click', writeDigit)
    })

    //Decimal
    document.querySelector('#decimal').addEventListener('click', writeDecimal)

    //Negate 
    document.querySelector('#negate').addEventListener('click', writeNegate)

    //AC


}

function countDigits() {
    return BOARD.textContent.replace(/[,\.\-]/g, '').length
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

