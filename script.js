let displayValue = '0';
let firstOperand = null;
let waitingForSecondOperand = false;
let operator = null;

const screen = document.querySelector('.screen');
const operandDisplay = document.querySelector('.operand-display');
const calculator = document.querySelector('.calculator');
const decimalButton = document.querySelector('[data-action="decimal"]');

window.addEventListener('keydown', handleKeyPress);

function inputDigit(digit) {
  if (waitingForSecondOperand === true) {
    displayValue = digit;
    waitingForSecondOperand = false;
  } else if (displayValue.length < 11) {
    displayValue = displayValue === '0' ? digit : displayValue + digit;
  }

  decimalButton.disabled = displayValue.includes('.');
}

function inputDecimal() {
  if (!displayValue.includes('.')) {
    displayValue += '.';
    decimalButton.disabled = true;
  }
}

// Function to delete digit
function deleteDigit() {
  displayValue = displayValue.length > 1 ? displayValue.slice(0, -1) : '0';

  decimalButton.disabled = displayValue.includes('.');
}

function clear() {
  displayValue = '0';
  firstOperand = null;
  waitingForSecondOperand = false;
  operator = null;
  operandDisplay.textContent = '';
  decimalButton.disabled = false;
}

function getOperatorSymbol(op) {
  switch (op) {
    case 'add':
      return '+';
    case 'subtract':
      return '-';
    case 'multiply':
      return '*';
    case 'divide':
      return '/';
    default:
      return '';
  }
}

function handleOperator(nextOperator) {
  const inputValue = parseFloat(displayValue);

  if (operator && waitingForSecondOperand) {
    operator = nextOperator;
    operandDisplay.textContent = `${firstOperand} ${getOperatorSymbol(
      operator
    )}`;
    return;
  }

  if (firstOperand == null && !isNaN(inputValue)) {
    firstOperand = inputValue;
    operandDisplay.textContent = `${firstOperand} ${getOperatorSymbol(
      operator
    )}`;
  } else if (operator) {
    const result = performCalculation(operator, firstOperand, inputValue);
    displayValue = `${parseFloat(result.toFixed(7))}`;

    // Ensure that the result does not exceed 11 digits
    if (displayValue.length > 11) {
      displayValue = displayValue.slice(0, 11);
    }

    firstOperand = parseFloat(displayValue);
    operandDisplay.textContent = `${firstOperand} ${getOperatorSymbol(
      nextOperator
    )}`;
  }

  if (nextOperator !== '=') {
    waitingForSecondOperand = true;
    operator = nextOperator;
    operandDisplay.textContent = `${firstOperand} ${getOperatorSymbol(
      operator
    )}`;
  }

  updateDisplay();
}

function performCalculation(op, a, b) {
  switch (op) {
    case 'add':
      return a + b;
    case 'subtract':
      return a - b;
    case 'multiply':
      return a * b;
    case 'divide':
      return b === 0 ? 'Error: Division by zero' : a / b;
    default:
      return b;
  }
}

function updateDisplay() {
  screen.textContent = displayValue;
}

updateDisplay();

calculator.addEventListener('click', (event) => {
  const { target } = event;

  if (!target.matches('button')) {
    return;
  }

  // If it's a .key-others button, remove the filter immediately after click
  if (target.classList.contains('key-others')) {
    // Temporarily add the filter effect
    target.style.filter = 'brightness(170%)';

    // Remove the filter effect after the transition ends
    setTimeout(() => {
      target.style.filter = 'none';
    }, 200);
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

  if (target.dataset.action)
    if (target.dataset.action === 'del') {
      deleteDigit();
      updateDisplay();
      return;
    }

  if (target.dataset.action === 'clear') {
    clear();
    updateDisplay();
    return;
  }
});

// Handling keyboard support
function handleKeyPress(e) {
  e.preventDefault();

  if (e.key >= 0 && e.key <= 9) {
    inputDigit(e.key);
    updateDisplay();
  }

  const operatorMap = {
    '+': 'add',
    '-': 'subtract',
    '*': 'multiply',
    '/': 'divide',
  };

  if (operatorMap[e.key]) {
    handleOperator(operatorMap[e.key]);
    updateDisplay();
  }

  if (e.key === 'Enter') {
    handleOperator('equals');
    updateDisplay();
  }

  if (e.key === '.') {
    inputDecimal();
    updateDisplay();
  }

  if (e.key === 'Backspace') {
    deleteDigit();
    updateDisplay();
  }

  // Handle clear key (if needed, assuming it's 'c' or 'Escape')
  if (e.key === 'Escape' || e.key === 'c') {
    clear();
    updateDisplay();
  }
}
