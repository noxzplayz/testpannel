// Professional Calculator JavaScript with history, expression display, and auto fill extra

document.addEventListener('DOMContentLoaded', () => {
  const screen = document.getElementById('calculator-screen');
  const keys = document.querySelector('.calculator-keys');
  const historyList = document.getElementById('history-list');
  const autoFillButton = document.getElementById('auto-fill-extra');

  let expression = '';
  let lastInputIsOperator = false;
  let lastResult = null;

  function updateScreen() {
    screen.value = expression || '0';
  }

  function appendToExpression(value) {
    if (lastInputIsOperator && isOperator(value)) {
      // Replace last operator with new one
      expression = expression.slice(0, -1) + value;
    } else {
      expression += value;
    }
    lastInputIsOperator = isOperator(value);
    updateScreen();
  }

  function isOperator(char) {
    return ['+', '−', '×', '÷'].includes(char);
  }

  function calculateExpression(expr) {
    // Replace operator symbols with JS operators
    const sanitizedExpr = expr.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-').replace(/\+/g, '+');
    try {
      // Use Function constructor to evaluate expression safely
      // eslint-disable-next-line no-new-func
      const result = Function(`"use strict";return (${sanitizedExpr})`)();
      return result;
    } catch {
      return 'Error';
    }
  }

  function saveHistory(entry) {
    let history = JSON.parse(localStorage.getItem('calcHistory')) || [];
    history.push(entry);
    localStorage.setItem('calcHistory', JSON.stringify(history));
    renderHistory();
  }

  function renderHistory() {
    let history = JSON.parse(localStorage.getItem('calcHistory')) || [];
    historyList.innerHTML = '';
    history.slice().reverse().forEach(({ expression, result }) => {
      const li = document.createElement('li');
      li.textContent = `${expression} = ${result}`;
      historyList.appendChild(li);
    });
  }

  function resetCalculator() {
    expression = '';
    lastInputIsOperator = false;
    updateScreen();
  }

  keys.addEventListener('click', (event) => {
    const { target } = event;
    if (!target.matches('button')) return;

    const action = target.dataset.action;
    const keyContent = target.textContent;

    if (target.id === 'clear') {
      resetCalculator();
      lastResult = null;
      return;
    }

    if (target.id === 'equals') {
      if (expression && !lastInputIsOperator) {
        const result = calculateExpression(expression);
        saveHistory({ expression, result });
        expression = String(result);
        lastInputIsOperator = false;
        lastResult = result;
        updateScreen();
      }
      return;
    }

    if (target.classList.contains('operator')) {
      appendToExpression(keyContent);
      return;
    }

    if (action === 'decimal') {
      // Prevent multiple decimals in the current number segment
      const parts = expression.split(/[\+\−\×\÷]/);
      const currentNumber = parts[parts.length - 1];
      if (!currentNumber.includes('.')) {
        appendToExpression('.');
      }
      return;
    }

    if (!isNaN(action)) {
      appendToExpression(action);
      return;
    }
  });

  const newBackButton = document.getElementById('new-back-button');
  if (newBackButton) {
    newBackButton.addEventListener('click', () => {
      console.log('New back button clicked');
      if (window.opener && !window.opener.closed) {
        console.log('Window opener exists, navigating to index.html');
        window.opener.location.href = 'index.html';
        window.close();
      } else {
        console.log('No window opener, just closing window');
        // Just close the calculator window without alert
        window.close();
      }
    });
  }

  renderHistory();
  resetCalculator();
});
