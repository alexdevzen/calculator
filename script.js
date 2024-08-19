let displayValue = '0';
let firstOperand = null;
let operator = null;
let waitingForSecondOperand = false;

const screen = document.querySelector('.screen');

function inputDigit(digit) {
    if (waitingForSecondOperand === true) {
        displayValue = digit;
        waitingForSecondOperand = false;
    } else {
        displayValue = displayValue === '0' ? digit : displayValue + digit;
    }
    if (displayValue.length > 15) {
        displayValue = displayValue.slice(0, 15);
    }
}

function inputDecimal() {
    if (waitingForSecondOperand === true) {
        displayValue = "0.";
        waitingForSecondOperand = false;
        return;
    }
    if (!displayValue.includes('.')) {
        displayValue += '.';
    }
}

function clear() {
    displayValue = '0';
    firstOperand = null;
    operator = null;
    waitingForSecondOperand = false;
}

function handleOperator(nextOperator) {
    const inputValue = parseFloat(displayValue);

    if (operator && waitingForSecondOperand) {
        operator = nextOperator;
        return;
    }

    if (firstOperand === null && !isNaN(inputValue)) {
        firstOperand = inputValue;
    } else if (operator) {
        const result = performCalculation[operator](firstOperand, inputValue);
        displayValue = `${parseFloat(result.toFixed(7))}`;
        firstOperand = result;
    }

    waitingForSecondOperand = true;
    operator = nextOperator;
}

const performCalculation = {
    '/': (firstOperand, secondOperand) => {
        if (secondOperand === 0) {
            return "Error: Division by zero";
        }
        return firstOperand / secondOperand;
    },
    '*': (firstOperand, secondOperand) => firstOperand * secondOperand,
    '+': (firstOperand, secondOperand) => firstOperand + secondOperand,
    '-': (firstOperand, secondOperand) => firstOperand - secondOperand,
    '=': (firstOperand, secondOperand) => secondOperand
};

function updateDisplay() {
    screen.textContent = displayValue;
}

function backspace() {
    if (displayValue.length > 1) {
        displayValue = displayValue.slice(0, -1);
    } else {
        displayValue = '0';
    }
}

updateDisplay();

const buttons = document.querySelector('.buttons');
buttons.addEventListener('click', (event) => {
    const { target } = event;
    if (!target.matches('button')) {
        return;
    }

    if (target.classList.contains('operator')) {
        handleOperator(target.dataset.action);
        updateDisplay();
        return;
    }

    if (target.classList.contains('number')) {
        inputDigit(target.textContent);
        updateDisplay();
        return;
    }

    if (target.dataset.action === 'decimal') {
        inputDecimal();
        updateDisplay();
        return;
    }

    if (target.dataset.action === 'clear') {
        clear();
        updateDisplay();
        return;
    }

    if (target.dataset.action === 'backspace') {
        backspace();
        updateDisplay();
        return;
    }
});

// Keyboard support
document.addEventListener('keydown', (event) => {
    if (event.key >= '0' && event.key <= '9') {
        inputDigit(event.key);
    } else if (event.key === '.') {
        inputDecimal();
    } else if (event.key === '=' || event.key === 'Enter') {
        handleOperator('=');
    } else if (event.key === 'Backspace') {
        backspace();
    } else if (event.key === 'Escape') {
        clear();
    } else if (['+', '-', '*', '/'].includes(event.key)) {
        handleOperator(event.key);
    }
    updateDisplay();
});


/* 

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
}); */