// Calculator State
let displayValue = '0';
let firstOperand = null;
let waitingForSecondOperand = false;
let operator = null;

// DOM Elements
const screen = document.querySelector('.screen');
const operandDisplay = document.querySelector('.operand-display');
const calculator = document.querySelector('.calculator');
const decimalButton = document.querySelector('[data-action="decimal"]');

// Initialize Display
updateDisplay();

// Event Listeners
calculator.addEventListener('click', handleButtonClick);
window.addEventListener('keydown', handleKeyPress);

// Helper Functions
function updateDisplay() {
  screen.textContent = displayValue;
}

function resetCalculator() {
  displayValue = '0';
  firstOperand = null;
  waitingForSecondOperand = false;
  operator = null;
  operandDisplay.textContent = '';
  decimalButton.disabled = false;
  updateDisplay();
}

function updateOperandDisplay(op) {
  operandDisplay.textContent = `${firstOperand} ${getOperatorSymbol(op)}`;
}

// Updated error display function
function displayError() {
  screen.textContent = 'Error';
  setTimeout(() => {
    resetCalculator();
  }, 2000);
}

function getOperatorSymbol(op) {
  const symbols = {
    add: '+',
    subtract: '-',
    multiply: '*',
    divide: '/',
  };
  return symbols[op] || '';
}

// Main Functions
function inputDigit(digit) {
  if (waitingForSecondOperand) {
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

function deleteDigit() {
  displayValue = displayValue.length > 1 ? displayValue.slice(0, -1) : '0';
  decimalButton.disabled = displayValue.includes('.');
}

function handleOperator(nextOperator) {
  const inputValue = parseFloat(displayValue);

  if (operator && waitingForSecondOperand) {
    operator = nextOperator;
    updateOperandDisplay(operator);
    return;
  }

  if (firstOperand == null && !isNaN(inputValue)) {
    firstOperand = inputValue;
  } else if (operator) {
    const result = performCalculation(operator, firstOperand, inputValue);

    // Check if the result is a valid number before processing
    if (typeof result === 'number' && !isNaN(result)) {
      displayValue = `${parseFloat(result.toFixed(4))}`;
      if (displayValue.length > 11) displayValue = displayValue.slice(0, 11);
      firstOperand = parseFloat(displayValue);
    } else {
      // Display error for invalid results (e.g., division by zero)
      displayError();
      return;
    }
  }

  if (nextOperator !== '=') {
    operator = nextOperator;
    waitingForSecondOperand = true;
    updateOperandDisplay(operator);
  } else {
    operator = null;
    operandDisplay.textContent = '';
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
      // Handle division by zero
      if (b === 0) {
        return NaN;
      }
      return a / b;
    default:
      return b;
  }
}

// Event Handlers
function handleButtonClick(event) {
  const { target } = event;

  if (!target.matches('button')) return;

  if (target.classList.contains('key-others')) {
    target.style.filter = 'brightness(170%)';
    setTimeout(() => (target.style.filter = 'none'), 200);
  }

  const action = target.dataset.action;

  if (target.classList.contains('operator')) {
    handleOperator(action);
  } else if (target.classList.contains('number')) {
    inputDigit(target.textContent);
  } else if (action === 'decimal') {
    inputDecimal();
  } else if (action === 'del') {
    deleteDigit();
  } else if (action === 'clear') {
    resetCalculator();
  }

  updateDisplay();
}

function handleKeyPress(e) {
  e.preventDefault();

  const keyMap = {
    0: () => inputDigit('0'),
    1: () => inputDigit('1'),
    2: () => inputDigit('2'),
    3: () => inputDigit('3'),
    4: () => inputDigit('4'),
    5: () => inputDigit('5'),
    6: () => inputDigit('6'),
    7: () => inputDigit('7'),
    8: () => inputDigit('8'),
    9: () => inputDigit('9'),
    '+': () => handleOperator('add'),
    '-': () => handleOperator('subtract'),
    '*': () => handleOperator('multiply'),
    '/': () => handleOperator('divide'),
    '.': inputDecimal,
    Enter: () => handleOperator('equals'),
    Backspace: deleteDigit,
    Escape: resetCalculator,
    c: resetCalculator,
  };

  if (keyMap[e.key]) {
    keyMap[e.key]();
    updateDisplay();
  }
}