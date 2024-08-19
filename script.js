let displayValue = '0';
let firstOperand = null;
let operator = null;
let waitingForSecondOperand = false;

const pantalla = document.querySelector('.pantalla');

function inputDigit(digit) {
    if (waitingForSecondOperand === true) {
        displayValue = digit;
        waitingForSecondOperand = false;
    } else {
        displayValue = displayValue === '0' ? digit : displayValue + digit;
    }
}

function inputDecimal() {
    if (!displayValue.includes('.')) {
        displayValue += '.';
    }
}

function clear() {
    displayValue = '0';
}

function handleOperator(nextOperator) {
    const inputValue = parseFloat(displayValue);

    if (operator && waitingForSecondOperand) {
        operator = nextOperator;
        return;
    }

    if (firstOperand === null) {
        firstOperand = inputValue;
    } else if (operator) {
        const result = performCalculation[operator](firstOperand, inputValue);
        displayValue = String(result);
        firstOperand = result;
    }

    waitingForSecondOperand = true;
    operator = nextOperator;
}

const performCalculation = {
    '/': (firstOperand, secondOperand) => firstOperand / secondOperand,
    '*': (firstOperand, secondOperand) => firstOperand * secondOperand,
    '+': (firstOperand, secondOperand) => firstOperand + secondOperand,
    '-': (firstOperand, secondOperand) => firstOperand - secondOperand,
    '=': (firstOperand, secondOperand) => secondOperand
};

function updateDisplay() {
    pantalla.textContent = displayValue;
}

updateDisplay();

const botones = document.querySelector('.botones');
botones.addEventListener('click', (event) => {
    const { target } = event;
    if (!target.matches('button')) {
        return;
    }

    if (target.classList.contains('operador')) {
        handleOperator(target.dataset.action);
        updateDisplay();
        return;
    }

    if (target.classList.contains('numero')) {
        inputDigit(target.textContent);
        updateDisplay();
        return;
    }

    if (target.dataset.action === 'decimal') {
        inputDecimal();
        updateDisplay();
        return;
    }

    if (target.dataset.action === 'borrar') {
        clear();
        updateDisplay();
        return;
    }
});