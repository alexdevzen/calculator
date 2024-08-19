// Initialize variables
let displayValue = '0';
let firstOperand = null;
let operator = null;
let waitingForSecondOperand = false;

// Get the display element
const screen = document.querySelector('.screen');

// Function to input a digit
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

// Function to input a decimal point
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

// Function to clear the calculator
function clear() {
    displayValue = '0';
    firstOperand = null;
    operator = null;
    waitingForSecondOperand = false;
}

// Function to handle operators
function handleOperator(nextOperator) {
    const inputValue = parseFloat(displayValue);

    if (operator && waitingForSecondOperand) {
        operator = nextOperator;
        return;
    }

    if (firstOperand === null && !isNaN(inputValue)) {
        firstOperand = inputValue;
    } else if (operator) {
        const result = performCalculation(operator, firstOperand, inputValue);
        displayValue = `${parseFloat(result.toFixed(7))}`;
        firstOperand = result;
    }

    waitingForSecondOperand = true;
    operator = nextOperator;
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
            if (b === 0) {
                return "Error: Division by zero";
            }
            return a / b;
        default:
            return b;
    }
}

// Function to update the display
function updateDisplay() {
    screen.textContent = displayValue;
}

// Function to handle backspace
function backspace() {
    if (displayValue.length > 1) {
        displayValue = displayValue.slice(0, -1);
    } else {
        displayValue = '0';
    }
}

// Initial display update
updateDisplay();

// Event listener for button clicks
const buttons = document.querySelector('.buttons');
buttons.addEventListener('click', (event) => {
    const { target } = event;
    if (!target.matches('button')) {
        return;
    }

    switch (target.dataset.action) {
        case 'add':
        case 'subtract':
        case 'multiply':
        case 'divide':
            handleOperator(target.dataset.action);
            break;
        case 'decimal':
            inputDecimal();
            break;
        case 'clear':
            clear();
            break;
        case 'backspace':
            backspace();
            break;
        case 'equals':
            handleOperator('=');
            break;
        default:
            if (target.classList.contains('number')) {
                inputDigit(target.textContent);
            }
            break;
    }

    updateDisplay();
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
    } else if (event.key === '+') {
        handleOperator('add');
    } else if (event.key === '-') {
        handleOperator('subtract');
    } else if (event.key === '*') {
        handleOperator('multiply');
    } else if (event.key === '/') {
        handleOperator('divide');
    }
    updateDisplay();
});