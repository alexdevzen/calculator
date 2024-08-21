let displayValue = '0';
let firstOperand = null;
let waitingForSecondOperand = false;
let operator = null;
let equalsPressed = false; // Restart the calculation after the math is done and a random number is pressed

const calculator = document.querySelector('.calculator');
const screen = document.querySelector('.screen');
const previousNumber = document.querySelector('.previousNumber');
const operators = document.querySelectorAll('.operator');

window.addEventListener('keydown', handleKeyPress);

function inputDigit(digit) {
  if (equalsPressed) {
    clear();
    equalsPressed = false;
  }

  if (displayValue.length >= 11) return;

  if (waitingForSecondOperand === true) {
    displayValue = digit;
    waitingForSecondOperand = false;
  } else {
    // Replace the display value if it's '0', otherwise append the digit
    displayValue = displayValue === '0' ? digit : displayValue + digit;
  }
}

function inputDecimal() {
  if (!displayValue.includes('.')) {
    displayValue += '.';
  }
}

// Function to delete digit
function deleteDigit() {
  displayValue = displayValue.length > 1 ? displayValue.slice(0, -1) : '0';
}

// Function to clear the calculator
function clear() {
  displayValue = '0';
  firstOperand = null;
  waitingForSecondOperand = false;
  operator = null;
}

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

  waitingForSecondOperand = true;

  // Update the screen to show the first operand and the operator
  previousNumber.textContent = `${firstOperand} ${
    nextOperator != 'Enter' ? nextOperator : ''
  }`;
  screen.textContent = displayValue;

  if (nextOperator === '=') {
    operator = null;
    firstOperand = null;
    waitingForSecondOperand = false;
    previousNumber.textContent = null;
    equalsPressed = true;
  } else {
    waitingForSecondOperand = true;
    operator = nextOperator;
    equalsPressed = false;
  }
}

function performCalculation(op, a, b) {
  switch (op) {
    case '+':
      return a + b;
    case '-':
      return a - b;
    case '*':
      return a * b;
    case '/':
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

  if (target.dataset.action === '.') {
    inputDecimal();
    updateDisplay();
    return;
  }

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

  if (['+', '-', '*', '/'].includes(e.key)) {
    handleOperator(e.key);
    updateDisplay();
  }
  if (e.key === 'Enter') {
    handleOperator('=');
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
