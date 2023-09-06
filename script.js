const MAX_DIGIT = 9
const BOARD = document.querySelector('p')
const WIDTH = BOARD.parentElement.offsetWidth
let FLAG_DECIMAL = false

function writeDigit() {
    let prompt = (BOARD.textContent + this.textContent)

    if (this.textContent == '.') {
        if (!FLAG_DECIMAL) {
            BOARD.textContent = prompt
            FLAG_DECIMAL = true
        }
        return
    }


    if (countDigits(prompt) > MAX_DIGIT) {
        return
    }

    console.log(prompt)
    BOARD.textContent = parseFloat(prompt.replace(/,/g, '')).toLocaleString('en-US', { maximumFractionDigits: 10 })
    dynamicFontSize()
}

function setUpDigitButtons() {
    let numbers = document.querySelectorAll('.number')
    numbers.forEach(number => {
        number.addEventListener('click', writeDigit)
    })
}

function countDigits(s) {
    return s.replace(/[,\.]/g, '').length
}

function setUpDecimalButton() {
    document.querySelector('.decimal').addEventListener('click', writeDecimal)
}

function getFontSize(element) {
    return parseInt(window.getComputedStyle(element).fontSize)
}

function dynamicFontSize() {
    while (BOARD.offsetWidth > WIDTH) {
        let size = getFontSize(BOARD)
        BOARD.style.fontSize = Math.floor(WIDTH / BOARD.offsetWidth * size) - 2 + 'px'
    }
}

setUpDigitButtons()

