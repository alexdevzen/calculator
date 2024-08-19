// Initialize variables
let displayValue = '0';
let firstOperand = null;
let waitingForSecondOperand = false;
let operator = null;

// Get the display element
const screen = document.querySelector('.screen');

// Function to input a digit
function inputDigit(digit) {
    if (waitingForSecondOperand === true) {
        displayValue = digit;
        waitingForSecondOperand = false;
    } else {
        // Replace the display value if it's '0', otherwise append the digit
        displayValue = displayValue === '0' ? digit : displayValue + digit;
    }
}

// Function to input a decimal point
function inputDecimal() {
    if (!displayValue.includes('.')) {
        displayValue += '.';
    }
}

// Function to clear the calculator
function clear() {
    displayValue = '0';
    firstOperand = null;
    waitingForSecondOperand = false;
    operator = null;
}

// Function to handle operators
function handleOperator(nextOperator) {
    const inputValue = parseFloat(displayValue);

    if (operator && waitingForSecondOperand) {
        operator = nextOperator;
        return;
    }

    if (firstOperand == null && !isNaN(inputValue)) {
        firstOperand = inputValue;
    } else if (operator) {
        const result = performCalculation(operator, firstOperand, inputValue);
        displayValue = `${parseFloat(result.toFixed(7))}`;
        firstOperand = result;
    }

    if (nextOperator === '=') {
        operator = null;
        firstOperand = null;
        waitingForSecondOperand = false;
    } else {
        waitingForSecondOperand = true;
        operator = nextOperator;
    }
}

// Function to perform calculations based on the operator
function performCalculation(op, a, b) {
    switch (op) {
        case 'add':
            return a + b;
        case 'subtract':
            return a - b;
        case 'multiply':
            return a * b;
        case 'divide':
            return b === 0 ? "Error: Division by zero" : a / b;
        default:
            return b;
    }
}

// Function to update the display
function updateDisplay() {
    screen.textContent = displayValue;
}

// Initial display update
updateDisplay();

// Event listener for button clicks
const calculator = document.querySelector('.calculator');
calculator.addEventListener('click', (event) => {
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
});