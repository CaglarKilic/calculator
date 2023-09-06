const MAX_DIGIT = 9
const BOARD = document.querySelector('p')
const WIDTH = BOARD.parentElement.offsetWidth

function writeDigit() {
    let prompt = (BOARD.textContent + this.textContent).replace(/,/g, '')
    if (prompt.length == 10) {
        return
    }
    BOARD.textContent = parseInt(prompt).toLocaleString('en-US')
    dynamicFontSize()
}

function setUpButtons() {
    let numbers = document.querySelectorAll('.number')
    numbers.forEach(number => {
        number.addEventListener('click', writeDigit)
    })
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

setUpButtons()

