// JavaScript functionality for Start Shift button and counters and next screens with UPI balance input, shift in progress, extra form, delivery form, issue form, and data persistence with delete, filter, and paid checkbox in analysis

document.addEventListener('DOMContentLoaded', () => {
  // Prevent zooming via keyboard shortcuts (Ctrl + +, Ctrl + -, Ctrl + 0)
  // and mouse wheel zoom (Ctrl + wheel)
  window.addEventListener('keydown', function (e) {
    if ((e.ctrlKey || e.metaKey) && (e.key === '+' || e.key === '-' || e.key === '=' || e.key === '0')) {
      e.preventDefault();
    }
  });

  window.addEventListener('wheel', function (e) {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
    }
  }, { passive: false });
  const mainContent = document.getElementById('main-content');
  const deliveryPortalButton = document.querySelector('.delivery-portal-button');
  const billingPortalButton = document.querySelector('.billing-portal-button');

  // Check if shift started
  const shiftStarted = localStorage.getItem('shiftStarted') === 'true';
  const savedState = localStorage.getItem('appState');
  const savedExtraFormData = JSON.parse(localStorage.getItem('extraFormData') || '{}');
  const savedDeliveryFormData = JSON.parse(localStorage.getItem('deliveryFormData') || '{}');
  const savedIssueFormData = JSON.parse(localStorage.getItem('issueFormData') || '{}');

  // Global event listener for autoFillExtraAmount to redirect to extra form with autofill
  window.addEventListener('autoFillExtraAmount', (e) => {
    const detail = e.detail || {};
    // Show extra form with autofill data, allow editing
    showExtraForm({
      completelyExtra: detail.completelyExtra || false,
      billNumber: detail.billNumber || '',
      extraAmount: detail.value || '',
      modePay: detail.modePay || '',
      itemCategory: detail.itemCategory || ''
    });
  });

  // Global event listener for showExtraForm to redirect to extra form without autofill
  window.addEventListener('showExtraForm', (e) => {
    showExtraForm(e.detail);
    // Focus the extra amount input field after showing the form
    setTimeout(() => {
      const extraAmountInput = document.getElementById('extra-amount');
      if (extraAmountInput) {
        extraAmountInput.focus();
        extraAmountInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  });

  if (shiftStarted) {
    if (savedState === 'shiftInProgress') {
      showShiftInProgress();
    } else if (savedState === 'extraForm') {
      showExtraForm(savedExtraFormData);
    } else if (savedState === 'deliveryForm') {
      showDeliveryForm(savedDeliveryFormData);
    } else if (savedState === 'issueForm') {
      showIssueForm(savedIssueFormData);
    } else if (savedState === 'analysisView') {
      showAnalysis();
    } else {
      showShiftInProgress();
    }
  } else {
    if (!billingPortalButton) return;
  }

  if (billingPortalButton) {
    billingPortalButton.addEventListener('click', () => {
      localStorage.setItem('shiftStarted', 'true');
      localStorage.setItem('shiftStartTime', new Date().toISOString());
      localStorage.setItem('appState', 'upiForm');
      mainContent.innerHTML = `
      <form id="upi-form" class="upi-form">
        <label for="upi-balance">What's my previous UPI balance?</label><br/>
        <input type="number" id="upi-balance" name="upi-balance" class="input-field"/><br/>
        <label><input type="checkbox" id="counter2-checkbox" name="counter2-checkbox"/> I am in counter 2</label><br/>
        <button type="submit" class="submit-button">Submit</button>
      </form>g
      `;

      const upiForm = document.getElementById('upi-form');
      if (!upiForm) return;
      upiForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const upiBalanceInput = document.getElementById('upi-balance');
        const counter2Checkbox = document.getElementById('counter2-checkbox');
        const upiBalance = upiBalanceInput.value;
        const isCounter2 = counter2Checkbox.checked;

        if (!isCounter2 && upiBalance.trim() === '') {
          alert('Please enter your previous UPI balance or check "I am in counter 2".');
          return;
        }

        if (isCounter2) {
          localStorage.setItem('activeCounter', 'counter2');
          localStorage.removeItem('upiBalance');
        } else {
          localStorage.setItem('activeCounter', 'counter1');
          localStorage.setItem('upiBalance', upiBalance);
        }

        localStorage.setItem('appState', 'shiftInProgress');
        showShiftInProgress();
      });
    });
  }

function showShiftInProgress() {
    localStorage.setItem('appState', 'shiftInProgress');
    mainContent.innerHTML = `
      <div class="shift-status">Shift in progress</div>
      <button class="action-button" id="extra-btn">Extra</button>
      <button class="action-button" id="delivery-btn">Delivery</button>
      <button class="action-button" id="issue-btn">Issue</button>
      <button class="action-button" id="analysis-btn">Analysis</button>
      <button class="action-button end-shift-button" id="end-shift-btn">End Shift</button>
    `;

    document.getElementById('extra-btn').addEventListener('click', () => {
      localStorage.setItem('appState', 'extraForm');
      showExtraForm();
    });
    document.getElementById('delivery-btn').addEventListener('click', () => {
      localStorage.setItem('appState', 'deliveryForm');
      showDeliveryForm();
    });
    document.getElementById('issue-btn').addEventListener('click', () => {
      localStorage.setItem('appState', 'issueForm');
      showIssueForm();
    });
    document.getElementById('analysis-btn').addEventListener('click', () => {
      localStorage.setItem('appState', 'analysisView');
      showAnalysis();
    });
    document.querySelector('.end-shift-button').addEventListener('click', endShift);
  }

  function showExtraForm(savedData = {}) {
      localStorage.setItem('appState', 'extraForm');
      mainContent.innerHTML = `
        <form id="extra-form" class="extra-form">
          <label><input type="checkbox" id="completely-extra" name="completely-extra" ${savedData.completelyExtra ? 'checked' : ''}/> Completely Extra</label><br/>
          <label for="bill-number">Bill Number:</label><br/>
          <input type="text" id="bill-number" name="bill-number" value="${savedData.billNumber || ''}" ${savedData.completelyExtra ? '' : 'required'} class="input-field" ${savedData.completelyExtra ? 'disabled' : ''}/><br/>
          <label for="extra-amount">Extra Amount:</label><br/>
          <input type="number" id="extra-amount" name="extra-amount" value="${savedData.extraAmount || ''}" required class="input-field"/><br/>
          <label for="mode-pay">Mode of Pay:</label><br/>
          <select id="mode-pay" name="mode-pay" required class="input-field">
            <option value="">Select</option>
            <option value="UPI" ${savedData.modePay === 'UPI' ? 'selected' : ''}>UPI</option>
            <option value="Cash" ${savedData.modePay === 'Cash' ? 'selected' : ''}>Cash</option>
            <option value="Card" ${savedData.modePay === 'Card' ? 'selected' : ''}>Card</option>
            <option value="Multiple" ${savedData.modePay === 'Multiple' ? 'selected' : ''}>Multiple</option>
          </select><br/>
          <label for="item-category">Item Category:</label><br/>
          <input type="text" id="item-category" name="item-category" value="${savedData.itemCategory || ''}" required class="input-field"/><br/>
          <button type="submit" class="action-button">Submit</button>
          <button type="button" id="calculator-btn" class="action-button">Calculator</button>
          <button type="button" id="extra-back-btn" class="action-button">Back</button>
        </form>
      `;

      // Create calculator modal container if not exists
      if (!document.getElementById('calculator-modal')) {
        const modal = document.createElement('div');
        modal.id = 'calculator-modal';
        modal.style.position = 'fixed';
        modal.style.top = '50%';
        modal.style.left = '50%';
        modal.style.transform = 'translate(-50%, -50%)';
        modal.style.backgroundColor = 'white';
        modal.style.borderRadius = '15px';
        modal.style.padding = '20px';
        modal.style.boxShadow = '0 0 15px rgba(0,0,0,0.3)';
        modal.style.maxWidth = '400px';
        modal.style.width = '90%';
        modal.style.maxHeight = '90%';
        modal.style.overflowY = 'auto';
        modal.style.zIndex = '10000';
        modal.style.display = 'none';

        // Remove overlay background color to remove overlay effect
        // So no backgroundColor or transparent background
        modal.style.backgroundColor = 'white';

        document.body.appendChild(modal);
      }

      // Add event listener for autoFillExtraAmount event to update extra-amount input and hide modal
      window.addEventListener('autoFillExtraAmount', (e) => {
        const extraAmountInput = document.getElementById('extra-amount');
        if (extraAmountInput) {
          extraAmountInput.value = e.detail.value;
        }
        hideCalculatorModal();
      });

      // Show calculator modal
      function showCalculatorModal() {
        const modal = document.getElementById('calculator-modal');
        const modalContent = document.getElementById('calculator-modal-content');
        if (modal && modalContent) {
          modal.style.display = 'flex';
          if (!modalContent.innerHTML) {
            fetch('calculator.html')
              .then(response => response.text())
              .then(html => {
                modalContent.innerHTML = html;
                const script = document.createElement('script');
                script.src = 'calculator.js';
                modalContent.appendChild(script);
              });
          }
        }
      }

      // Hide calculator modal
      function hideCalculatorModal() {
        const modal = document.getElementById('calculator-modal');
        if (modal) {
          modal.style.display = 'none';
        }
      }

      // Close modal when clicking outside modal content
      document.getElementById('calculator-modal').addEventListener('click', (e) => {
        if (e.target.id === 'calculator-modal') {
          hideCalculatorModal();
        }
      });

      document.getElementById('calculator-btn').addEventListener('click', () => {
        const modal = document.getElementById('calculator-modal');
        if (modal.style.display === 'flex') {
          hideCalculatorModal();
        } else {
          showCalculatorModal();
        }
      });

      // Add event listener for autoFillExtraAmount event to update extra-amount input
      window.addEventListener('autoFillExtraAmount', (e) => {
        const extraAmountInput = document.getElementById('extra-amount');
        if (extraAmountInput) {
          extraAmountInput.value = e.detail.value;
        }
      });

    const extraForm = document.getElementById('extra-form');
    const completelyExtraCheckbox = document.getElementById('completely-extra');
    const billNumberInput = document.getElementById('bill-number');
    const extraAmountInput = document.getElementById('extra-amount');

    function toggleBillNumber() {
      if (completelyExtraCheckbox.checked) {
        billNumberInput.disabled = true;
        billNumberInput.required = false;
      } else {
        billNumberInput.disabled = false;
        billNumberInput.required = true;
      }
    }

    completelyExtraCheckbox.addEventListener('change', () => {
      toggleBillNumber();
      // Save form data on checkbox change
      const formData = {
        completelyExtra: completelyExtraCheckbox.checked,
        billNumber: billNumberInput.value,
        extraAmount: extraAmountInput.value,
        modePay: document.getElementById('mode-pay').value,
        itemCategory: document.getElementById('item-category').value,
      };
      localStorage.setItem('extraFormData', JSON.stringify(formData));
    });

    toggleBillNumber();

    extraForm.addEventListener('input', () => {
      const formData = {
        completelyExtra: completelyExtraCheckbox.checked,
        billNumber: billNumberInput.value,
        extraAmount: extraAmountInput.value,
        modePay: document.getElementById('mode-pay').value,
        itemCategory: document.getElementById('item-category').value,
      };
      localStorage.setItem('extraFormData', JSON.stringify(formData));
    });

    extraForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const completelyExtra = completelyExtraCheckbox.checked;
      const billNumber = billNumberInput.value.trim();
      const extraAmount = extraAmountInput.value.trim();
      const modePay = document.getElementById('mode-pay').value;
      const itemCategory = document.getElementById('item-category').value.trim();

      if (!completelyExtra && !billNumber) {
        alert('Please fill all fields.');
        return;
      }
      if (!extraAmount || !modePay || !itemCategory) {
        alert('Please fill all fields.');
        return;
      }

      // Create structured data object with consistent keys and types
      const newExtraEntry = {
        completelyExtra: Boolean(completelyExtra),
        billNumber: billNumber || null,
        extraAmount: parseFloat(extraAmount),
        modePay: modePay,
        itemCategory: itemCategory
      };

      let extraData = JSON.parse(localStorage.getItem('extraData')) || [];
      extraData.push(newExtraEntry);
      localStorage.setItem('extraData', JSON.stringify(extraData));
      localStorage.removeItem('extraFormData');

      alert('Extra data saved.');

      localStorage.setItem('appState', 'shiftInProgress');
      showShiftInProgress();
    });

    document.getElementById('extra-back-btn').addEventListener('click', () => {
      localStorage.setItem('appState', 'shiftInProgress');
      localStorage.removeItem('extraFormData');
      showShiftInProgress();
    });

    document.getElementById('calculator-btn').addEventListener('click', () => {
      window.location.href = 'calculator.html';
    });
  }

  function showDeliveryForm(savedData = {}) {
    localStorage.setItem('appState', 'deliveryForm');
    mainContent.innerHTML = `
      <form id="delivery-form" class="extra-form">
        <label for="bill-number-delivery">Bill Number:</label><br/>
        <input type="text" id="bill-number-delivery" name="bill-number-delivery" value="${savedData.billNumber || ''}" required class="input-field"/><br/>
        <label for="amount-delivery">Amount:</label><br/>
        <input type="number" id="amount-delivery" name="amount-delivery" value="${savedData.amount || ''}" required class="input-field"/><br/>
        <label for="mode-pay-delivery">Mode of Pay:</label><br/>
        <select id="mode-pay-delivery" name="mode-pay-delivery" required class="input-field">
          <option value="">Select</option>
          <option value="UPI" ${savedData.modePay === 'UPI' ? 'selected' : ''}>UPI</option>
          <option value="Cash" ${savedData.modePay === 'Cash' ? 'selected' : ''}>Cash</option>
          <option value="Card" ${savedData.modePay === 'Card' ? 'selected' : ''}>Card</option>
          <option value="Multiple" ${savedData.modePay === 'Multiple' ? 'selected' : ''}>Multiple</option>
        </select><br/>
        <button type="submit" class="action-button">Save</button>
        <button type="button" id="delivery-back-btn" class="action-button">Back</button>
      </form>
    `;

    const deliveryForm = document.getElementById('delivery-form');
    deliveryForm.addEventListener('input', () => {
      const formData = {
        billNumber: document.getElementById('bill-number-delivery').value,
        amount: document.getElementById('amount-delivery').value,
        modePay: document.getElementById('mode-pay-delivery').value,
      };
      localStorage.setItem('deliveryFormData', JSON.stringify(formData));
    });

    deliveryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const billNumber = document.getElementById('bill-number-delivery').value.trim();
      const amount = document.getElementById('amount-delivery').value.trim();
      const modePay = document.getElementById('mode-pay-delivery').value;

      if (!billNumber || !amount || !modePay) {
        alert('Please fill all fields.');
        return;
      }

      let deliveryData = JSON.parse(localStorage.getItem('deliveryData')) || [];
      deliveryData.push({ billNumber, amount, modePay, paid: false });
      localStorage.setItem('deliveryData', JSON.stringify(deliveryData));
      localStorage.removeItem('deliveryFormData');

      alert('Delivery data saved.');

      localStorage.setItem('appState', 'shiftInProgress');
      showShiftInProgress();
    });

    document.getElementById('delivery-back-btn').addEventListener('click', () => {
      localStorage.setItem('appState', 'shiftInProgress');
      localStorage.removeItem('deliveryFormData');
      showShiftInProgress();
    });
  }

  function showIssueForm(savedData = {}) {
    localStorage.setItem('appState', 'issueForm');
    mainContent.innerHTML = `
      <form id="issue-form" class="extra-form">
        <label for="bill-number-issue">Bill Number:</label><br/>
        <input type="text" id="bill-number-issue" name="bill-number-issue" value="${savedData.billNumber || ''}" required class="input-field"/><br/>
        <label for="issue-text">Issue:</label><br/>
        <textarea id="issue-text" name="issue-text" rows="4" required class="input-field">${savedData.issueText || ''}</textarea><br/>
        <button type="submit" class="action-button">Submit</button>
        <button type="button" id="issue-back-btn" class="action-button">Back</button>
      </form>
    `;

    const issueForm = document.getElementById('issue-form');
    issueForm.addEventListener('input', () => {
      const formData = {
        billNumber: document.getElementById('bill-number-issue').value,
        issueText: document.getElementById('issue-text').value,
      };
      localStorage.setItem('issueFormData', JSON.stringify(formData));
    });

    issueForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const billNumber = document.getElementById('bill-number-issue').value.trim();
      const issueText = document.getElementById('issue-text').value.trim();

      if (!billNumber || !issueText) {
        alert('Please fill all fields.');
        return;
      }

      let issueData = JSON.parse(localStorage.getItem('issueData')) || [];
      issueData.push({ billNumber, issueText });
      localStorage.setItem('issueData', JSON.stringify(issueData));
      localStorage.removeItem('issueFormData');

      alert('Issue data saved.');

      localStorage.setItem('appState', 'shiftInProgress');
      showShiftInProgress();
    });

    document.getElementById('issue-back-btn').addEventListener('click', () => {
      localStorage.setItem('appState', 'shiftInProgress');
      localStorage.removeItem('issueFormData');
      showShiftInProgress();
    });
  }

function showAnalysis() {
    localStorage.setItem('appState', 'analysisView');
    let extraData = JSON.parse(localStorage.getItem('extraData')) || [];
    let deliveryData = JSON.parse(localStorage.getItem('deliveryData')) || [];
    let issueData = JSON.parse(localStorage.getItem('issueData')) || [];

    mainContent.innerHTML = `
      <div class="shift-status analysis-title">Analysis</div>
      <div id="date-time-display" style="font-weight:bold; margin-bottom:10px; font-family: Arial, sans-serif;"></div>
      <div class="analysis-tabs">
        <button class="tab-button" id="tab-extra">View Extra</button>
        <button class="tab-button" id="tab-delivery">View Delivery</button>
        <button class="tab-button" id="tab-issue">View Issue</button>
      </div>
      <div id="filter-container" class="filter-container"></div>
      <div id="analysis-content"></div>
      <button class="action-button" id="analysis-back-btn">Back</button>
    `;

    const analysisContent = document.getElementById('analysis-content');
    const filterContainer = document.getElementById('filter-container');
    const dateTimeDisplay = document.getElementById('date-time-display');

    // Function to format date and time
    function formatDateTime(date) {
      const options = {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
        hour12: true
      };
      return date.toLocaleString('en-US', options);
    }

    // Display UPI balance below date/time
    const upiBalance = localStorage.getItem('upiBalance');
    const activeCounter = localStorage.getItem('activeCounter') || 'counter1';

    if (upiBalance !== null) {
      const upiDisplay = document.createElement('div');
      upiDisplay.style.fontWeight = 'bold';
      upiDisplay.style.marginBottom = '10px';
      upiDisplay.style.fontFamily = 'Arial, sans-serif';
      upiDisplay.style.color = '#2c3e50';
      upiDisplay.style.fontSize = '18px';
      upiDisplay.style.border = '1px solid #2980b9';
      upiDisplay.style.padding = '8px 12px';
      upiDisplay.style.borderRadius = '6px';
      upiDisplay.style.backgroundColor = '#ecf0f1';
      upiDisplay.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
      upiDisplay.textContent = `UPI Before Checking: ₹${upiBalance}`;
      dateTimeDisplay.parentNode.insertBefore(upiDisplay, dateTimeDisplay.nextSibling);
    }

    // Display active counter below UPI balance or shift start time
    const counterDisplay = document.createElement('div');
    counterDisplay.style.fontWeight = 'bold';
    counterDisplay.style.marginBottom = '10px';
    counterDisplay.style.fontFamily = 'Arial, sans-serif';
    counterDisplay.style.color = '#34495e';
    counterDisplay.style.fontSize = '18px';
    counterDisplay.style.border = '1px solid #2980b9';
    counterDisplay.style.padding = '8px 12px';
    counterDisplay.style.borderRadius = '6px';
    counterDisplay.style.backgroundColor = '#ecf0f1';
    counterDisplay.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
    counterDisplay.textContent = `Active Counter: ${activeCounter === 'counter2' ? 'Counter 2' : 'Counter 1'}`;
    dateTimeDisplay.parentNode.insertBefore(counterDisplay, dateTimeDisplay.nextSibling.nextSibling);

    // Display shift start time below UPI balance
    const shiftStartTimeISO = localStorage.getItem('shiftStartTime');
    if (shiftStartTimeISO) {
      const shiftStartTime = new Date(shiftStartTimeISO);
      const shiftStartDisplay = document.createElement('div');
      shiftStartDisplay.style.fontWeight = 'bold';
      shiftStartDisplay.style.marginBottom = '10px';
      shiftStartDisplay.style.fontFamily = 'Arial, sans-serif';
      shiftStartDisplay.style.color = '#2c3e50';
      shiftStartDisplay.style.fontSize = '18px';
      shiftStartDisplay.style.border = '1px solid #2980b9';
      shiftStartDisplay.style.padding = '8px 12px';
      shiftStartDisplay.style.borderRadius = '6px';
      shiftStartDisplay.style.backgroundColor = '#ecf0f1';
      shiftStartDisplay.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
      shiftStartDisplay.textContent = `Shift Started: ${shiftStartTime.toLocaleString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
        hour12: true
      })}`;
      dateTimeDisplay.parentNode.insertBefore(shiftStartDisplay, dateTimeDisplay.nextSibling.nextSibling);
    }

    // Update date and time every second
    function updateDateTime() {
      const now = new Date();
      dateTimeDisplay.textContent = formatDateTime(now);
    }

    updateDateTime();
    const dateTimeInterval = setInterval(updateDateTime, 1000);

    // Clear interval when leaving analysis view
    function clearDateTimeInterval() {
      clearInterval(dateTimeInterval);
    }

    // Attach event listener to back button to clear interval
    const analysisBackBtn = document.getElementById('analysis-back-btn');
    if (analysisBackBtn) {
      analysisBackBtn.addEventListener('click', () => {
        clearDateTimeInterval();
        localStorage.setItem('appState', 'shiftInProgress');
        showShiftInProgress();
      });
    }

    function renderTable(data, type) {
      if (data.length === 0) {
        analysisContent.innerHTML = `<div>No ${type} Data Available</div>`;
        filterContainer.innerHTML = '';
        return;
      }

      // Add filter dropdown for pay modes except for Issue (which has no pay mode)
      if (type !== 'Issue') {
        filterContainer.innerHTML = `
          <label for="filter-mode-pay">Filter by Mode of Pay:</label>
          <select id="filter-mode-pay" class="input-field" style="margin-bottom: 15px;">
            <option value="All">All</option>
            <option value="UPI">UPI</option>
            <option value="Cash">Cash</option>
            <option value="Card">Card</option>
            <option value="Multiple">Multiple</option>
          </select>
        `;

        const filterSelect = document.getElementById('filter-mode-pay');
        filterSelect.addEventListener('change', () => {
          const filterValue = filterSelect.value;
          if (filterValue === 'All') {
            renderTable(data, type);
          } else {
            const filteredData = data.filter(item => item.modePay === filterValue);
            renderTable(filteredData, type);
          }
        });
      } else {
        filterContainer.innerHTML = '';
      }

      function formatCurrency(value) {
        if (!value) return '';
        const number = parseFloat(value);
        if (isNaN(number)) return value;
        return '₹' + number.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      }

      let rows = data.map((item, index) => {
        if (type === 'Extra') {
          return `
            <tr>
              <td>${index + 1}</td>
              <td>${item.completelyExtra ? 'CE' : item.billNumber}</td>
              <td>${formatCurrency(item.extraAmount)}</td>
              <td>${item.modePay}</td>
              <td>${item.itemCategory}</td>
              <td>
                <button class="edit-btn" data-index="${index}" data-type="extra">Edit</button>
                <button class="delete-btn" data-index="${index}" data-type="extra">Delete</button>
              </td>
            </tr>
          `;
        } else if (type === 'Delivery') {
          return `
            <tr>
              <td>${index + 1}</td>
              <td>${item.billNumber}</td>
              <td>${formatCurrency(item.amount)}</td>
              <td>${item.modePay}</td>
              <td><input type="checkbox" class="paid-checkbox" data-index="${index}" ${item.paid ? 'checked' : ''}></td>
              <td>
                <button class="edit-btn" data-index="${index}" data-type="delivery">Edit</button>
                <button class="delete-btn" data-index="${index}" data-type="delivery">Delete</button>
              </td>
            </tr>
          `;
        } else if (type === 'Issue') {
          return `
            <tr>
              <td>${index + 1}</td>
              <td>${item.billNumber}</td>
              <td colspan="4">${item.issueText}</td>
              <td>
                <button class="edit-btn" data-index="${index}" data-type="issue">Edit</button>
                <button class="delete-btn" data-index="${index}" data-type="issue">Delete</button>
              </td>
            </tr>
          `;
        }
      }).join('');

      let headers = '';
      if (type === 'Extra') {
        headers = `
          <th>#</th>
          <th>Bill Number</th>
          <th>Extra Amount</th>
          <th>Mode of Pay</th>
          <th>Item Category</th>
          <th>Action</th>
        `;
      } else if (type === 'Delivery') {
        headers = `
          <th>#</th>
          <th>Bill Number</th>
          <th>Amount</th>
          <th>Mode of Pay</th>
          <th>Paid</th>
          <th>Action</th>
        `;
      } else if (type === 'Issue') {
        headers = `
          <th>#</th>
          <th>Bill Number</th>
          <th colspan="4">Issue Description</th>
          <th>Action</th>
        `;
      }

      analysisContent.innerHTML = `
        <table class="extra-table analysis-table">
          <thead>
            <tr>${headers}</tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      `;

      // Add sum of UPI and Cash payments below the table for Extra section
      if (type === 'Extra') {
        const sumUPI = data.reduce((sum, item) => {
          return sum + (item.modePay === 'UPI' ? parseFloat(item.extraAmount) || 0 : 0);
        }, 0);
        const sumCash = data.reduce((sum, item) => {
          return sum + (item.modePay === 'Cash' ? parseFloat(item.extraAmount) || 0 : 0);
        }, 0);
        const sumCard = data.reduce((sum, item) => {
          return sum + (item.modePay === 'Card' ? parseFloat(item.extraAmount) || 0 : 0);
        }, 0);

        const sumDiv = document.createElement('div');
        sumDiv.style.marginTop = '15px';
        sumDiv.style.fontWeight = 'bold';
        sumDiv.style.fontSize = '1.2em';
        sumDiv.style.color = '#007acc';
        sumDiv.innerHTML = `
          <div>Total UPI: ₹${sumUPI.toFixed(2)}</div>
          <div>Total Cash: ₹${sumCash.toFixed(2)}</div>
          <div>Total Card: ₹${sumCard.toFixed(2)}</div>
        `;
        analysisContent.appendChild(sumDiv);
      }

      // Add delete button event listeners
      const deleteButtons = analysisContent.querySelectorAll('.delete-btn');
      deleteButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          const idx = parseInt(btn.getAttribute('data-index'));
          const dataType = btn.getAttribute('data-type');
          if (dataType === 'extra') {
            extraData.splice(idx, 1);
            localStorage.setItem('extraData', JSON.stringify(extraData));
            renderTable(extraData, 'Extra');
          } else if (dataType === 'delivery') {
            deliveryData.splice(idx, 1);
            localStorage.setItem('deliveryData', JSON.stringify(deliveryData));
            renderTable(deliveryData, 'Delivery');
          } else if (dataType === 'issue') {
            issueData.splice(idx, 1);
            localStorage.setItem('issueData', JSON.stringify(issueData));
            renderTable(issueData, 'Issue');
          }
        });
      });

      // Add edit button event listeners
      const editButtons = analysisContent.querySelectorAll('.edit-btn');
      editButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          const idx = parseInt(btn.getAttribute('data-index'));
          const dataType = btn.getAttribute('data-type');
          if (dataType === 'extra') {
            showExtraForm(extraData[idx]);
          } else if (dataType === 'delivery') {
            showDeliveryForm(deliveryData[idx]);
          } else if (dataType === 'issue') {
            showIssueForm(issueData[idx]);
          }
        });
      });

      // Add paid checkbox event listeners for delivery
      if (type === 'Delivery') {
        const paidCheckboxes = analysisContent.querySelectorAll('.paid-checkbox');
        paidCheckboxes.forEach(checkbox => {
          checkbox.addEventListener('change', () => {
            const idx = parseInt(checkbox.getAttribute('data-index'));
            deliveryData[idx].paid = checkbox.checked;
            localStorage.setItem('deliveryData', JSON.stringify(deliveryData));
          });
        });
      }
    }

    renderTable(extraData, 'Extra');

    document.getElementById('tab-extra').addEventListener('click', () => {
      renderTable(extraData, 'Extra');
    });
    document.getElementById('tab-delivery').addEventListener('click', () => {
      renderTable(deliveryData, 'Delivery');
    });
    document.getElementById('tab-issue').addEventListener('click', () => {
      renderTable(issueData, 'Issue');
    });

    document.getElementById('analysis-back-btn').addEventListener('click', () => {
      localStorage.setItem('appState', 'shiftInProgress');
      showShiftInProgress();
    });
  }

function endShift() {
  if (!confirm("Warning: All data will be erased. Do you want to continue?")) {
    return;
  }

  const analysisContent = document.getElementById('analysis-content');
  if (!analysisContent) {
    // Remove alert, show modal with checkbox and buttons
    showScreenshotCheckModal();
    return;
  }

  // Use html2canvas to capture screenshot of analysis section
  html2canvas(analysisContent).then(canvas => {
    const imageData = canvas.toDataURL('image/png');

    // Placeholder function to send screenshot to admin
    sendScreenshotToAdmin(imageData).then(() => {
      alert("Screenshot sent to admin for verification. Now clearing data.");
      clearDataAndReset();
    }).catch(() => {
      alert("Failed to send screenshot to admin. Data will not be erased.");
    });
  }).catch(() => {
    alert("Failed to capture screenshot. Data will not be erased.");
  });

  function clearDataAndReset() {
    // Clear all relevant localStorage data
    localStorage.removeItem('extraData');
    localStorage.removeItem('deliveryData');
    localStorage.removeItem('issueData');
    localStorage.removeItem('extraFormData');
    localStorage.removeItem('deliveryFormData');
    localStorage.removeItem('issueFormData');
    localStorage.removeItem('shiftStarted');
    localStorage.removeItem('appState');

    // Reload the page or reset UI
    location.reload();
  }

  // Placeholder async function to send screenshot to admin
  async function sendScreenshotToAdmin(imageData) {
    // TODO: Implement actual sending logic here, e.g., POST to server API
    // For now, simulate success with a resolved promise after delay
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log("Screenshot data sent to admin (simulated).");
        resolve();
      }, 1000);
    });
  }

  // Show modal with checkbox and buttons for screenshot confirmation
  function showScreenshotCheckModal() {
    // Create modal overlay
    const modalOverlay = document.createElement('div');
    modalOverlay.id = 'screenshot-check-modal';
    modalOverlay.style.position = 'fixed';
    modalOverlay.style.top = '0';
    modalOverlay.style.left = '0';
    modalOverlay.style.width = '100%';
    modalOverlay.style.height = '100%';
    modalOverlay.style.backgroundColor = 'rgba(0,0,0,0.5)';
    modalOverlay.style.display = 'flex';
    modalOverlay.style.flexDirection = 'column';
    modalOverlay.style.justifyContent = 'center';
    modalOverlay.style.alignItems = 'center';
    modalOverlay.style.zIndex = '10000';

    // Modal content container
    const modalContent = document.createElement('div');
    modalContent.style.backgroundColor = 'white';
    modalContent.style.padding = '30px';
    modalContent.style.borderRadius = '10px';
    modalContent.style.textAlign = 'center';
    modalContent.style.color = '#4b0082';
    modalContent.style.fontFamily = 'Arial, sans-serif';
    modalContent.style.width = '350px';

    // Message
    const message = document.createElement('p');
    message.textContent = 'Did you take a screenshot of the analysis section?';
    message.style.marginBottom = '20px';
    modalContent.appendChild(message);

    // Checkbox container
    const checkboxLabel = document.createElement('label');
    checkboxLabel.style.display = 'flex';
    checkboxLabel.style.alignItems = 'center';
    checkboxLabel.style.justifyContent = 'center';
    checkboxLabel.style.marginBottom = '20px';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = 'screenshot-confirm-checkbox';
    checkbox.style.marginRight = '10px';

    const labelText = document.createTextNode('Yes, I took the screenshot');

    checkboxLabel.appendChild(checkbox);
    checkboxLabel.appendChild(labelText);
    modalContent.appendChild(checkboxLabel);

    // Buttons container
    const buttonsDiv = document.createElement('div');
    buttonsDiv.style.display = 'flex';
    buttonsDiv.style.justifyContent = 'space-around';

    // Yes button
    const yesButton = document.createElement('button');
    yesButton.textContent = 'Proceed to End Shift';
    yesButton.style.backgroundColor = '#4b0082';
    yesButton.style.color = 'white';
    yesButton.style.border = 'none';
    yesButton.style.padding = '10px 20px';
    yesButton.style.borderRadius = '5px';
    yesButton.style.cursor = 'pointer';
    yesButton.disabled = true;

    // No button
    const noButton = document.createElement('button');
    noButton.textContent = 'Go to Analysis';
    noButton.style.backgroundColor = '#ff0000';
    noButton.style.color = 'white';
    noButton.style.border = 'none';
    noButton.style.padding = '10px 20px';
    noButton.style.borderRadius = '5px';
    noButton.style.cursor = 'pointer';

    buttonsDiv.appendChild(yesButton);
    buttonsDiv.appendChild(noButton);
    modalContent.appendChild(buttonsDiv);

    modalOverlay.appendChild(modalContent);
    document.body.appendChild(modalOverlay);

    // Enable yes button only if checkbox is checked
    checkbox.addEventListener('change', () => {
      yesButton.disabled = !checkbox.checked;
    });

    // Yes button click handler
    yesButton.addEventListener('click', () => {
      document.body.removeChild(modalOverlay);
      clearDataAndReset();
    });

    // No button click handler
    noButton.addEventListener('click', () => {
      document.body.removeChild(modalOverlay);
      showAnalysis();
    });
  }
}
});

// Calculator functionality
