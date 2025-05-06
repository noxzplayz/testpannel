// Professional Calculator JavaScript

document.addEventListener('DOMContentLoaded', () => {
  const screen = document.getElementById('calculator-screen');
  const keys = document.querySelector('.calculator-keys');

  let firstOperand = null;
  let operator = null;
  let waitingForSecondOperand = false;

  function inputDigit(digit) {
    if (waitingForSecondOperand) {
      screen.value = digit;
      waitingForSecondOperand = false;
    } else {
      screen.value = screen.value === '0' ? digit : screen.value + digit;
    }
  }

  function inputDecimal() {
    if (waitingForSecondOperand) {
      screen.value = '0.';
      waitingForSecondOperand = false;
      return;
    }
    if (!screen.value.includes('.')) {
      screen.value += '.';
    }
  }

  function handleOperator(nextOperator) {
    const inputValue = parseFloat(screen.value);

    if (operator && waitingForSecondOperand) {
      operator = nextOperator;
      return;
    }

    if (firstOperand === null) {
      firstOperand = inputValue;
    } else if (operator) {
      const result = calculate(firstOperand, inputValue, operator);
      screen.value = String(result);
      firstOperand = result;
    }

    operator = nextOperator;
    waitingForSecondOperand = true;
  }

  function calculate(first, second, operator) {
    switch (operator) {
      case 'add':
        return first + second;
      case 'subtract':
        return first - second;
      case 'multiply':
        return first * second;
      case 'divide':
        return second === 0 ? 'Error' : first / second;
      default:
        return second;
    }
  }

  function resetCalculator() {
    screen.value = '0';
    firstOperand = null;
    operator = null;
    waitingForSecondOperand = false;
  }

  keys.addEventListener('click', (event) => {
    const { target } = event;
    if (!target.matches('button')) return;

    if (target.id === 'clear') {
      resetCalculator();
      return;
    }

    if (target.id === 'equals') {
      if (operator && !waitingForSecondOperand) {
        const inputValue = parseFloat(screen.value);
        const result = calculate(firstOperand, inputValue, operator);
        screen.value = String(result);
        firstOperand = null;
        operator = null;
        waitingForSecondOperand = false;
      }
      return;
    }

    if (target.classList.contains('operator')) {
      handleOperator(target.dataset.action);
      return;
    }

    if (target.dataset.action === 'decimal') {
      inputDecimal();
      return;
    }

    if (!isNaN(target.dataset.action)) {
      inputDigit(target.dataset.action);
      return;
    }
  });

  resetCalculator();
});
