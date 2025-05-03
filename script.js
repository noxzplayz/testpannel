// JavaScript functionality for Start Shift button and counters and next screens with UPI balance input, shift in progress, extra form, delivery form, issue form, and data persistence with delete, filter, and paid checkbox in analysis

document.addEventListener('DOMContentLoaded', () => {
  const mainContent = document.getElementById('main-content');
  const startShiftButton = document.querySelector('.start-shift-button');

  // Check if shift started
  const shiftStarted = localStorage.getItem('shiftStarted') === 'true';
  const savedState = localStorage.getItem('appState');
  const savedExtraFormData = JSON.parse(localStorage.getItem('extraFormData') || '{}');
  const savedDeliveryFormData = JSON.parse(localStorage.getItem('deliveryFormData') || '{}');
  const savedIssueFormData = JSON.parse(localStorage.getItem('issueFormData') || '{}');

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
    if (!startShiftButton) return;
  }

  if (startShiftButton) {
    startShiftButton.addEventListener('click', () => {
      localStorage.setItem('shiftStarted', 'true');
      localStorage.setItem('appState', 'shiftInProgress');
      mainContent.innerHTML = `
        <button id="counter1" class="counter-button">Counter 1</button>
        <button id="counter2" class="counter-button">Counter 2</button>
      `;

      const counter1 = document.getElementById('counter1');
      const counter2 = document.getElementById('counter2');

      if (!counter1 || !counter2) return;

      counter1.addEventListener('click', () => {
        mainContent.innerHTML = `
          <form id="upi-form" class="upi-form">
            <label for="upi-balance">What's my previous UPI balance?</label><br/>
            <input type="number" id="upi-balance" name="upi-balance" required class="input-field"/><br/>
            <button type="submit" class="action-button">Submit</button>
          </form>
        `;

        const upiForm = document.getElementById('upi-form');
        if (!upiForm) return;
        upiForm.addEventListener('submit', (e) => {
          e.preventDefault();
          const upiBalance = document.getElementById('upi-balance').value;
          if (upiBalance.trim() === '') {
            alert('Please enter your previous UPI balance.');
            return;
          }
          localStorage.setItem('appState', 'shiftInProgress');
          showShiftInProgress();
        });
      });

      counter2.addEventListener('click', () => {
        alert('Counter 2 clicked');
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
        <label for="bill-number">Bill Number:</label><br/>
        <input type="text" id="bill-number" name="bill-number" value="${savedData.billNumber || ''}" required class="input-field"/><br/>
        <label for="extra-amount">Extra Amount:</label><br/>
        <input type="number" id="extra-amount" name="extra-amount" value="${savedData.extraAmount || ''}" required class="input-field"/><br/>
        <label for="mode-pay">Mode of Pay:</label><br/>
        <select id="mode-pay" name="mode-pay" required class="input-field">
          <option value="">Select</option>
          <option value="UPI" ${savedData.modePay === 'UPI' ? 'selected' : ''}>UPI</option>
          <option value="Cash" ${savedData.modePay === 'Cash' ? 'selected' : ''}>Cash</option>
          <option value="Card" ${savedData.modePay === 'Card' ? 'selected' : ''}>Card</option>
        </select><br/>
        <label for="item-category">Item Category:</label><br/>
        <input type="text" id="item-category" name="item-category" value="${savedData.itemCategory || ''}" required class="input-field"/><br/>
        <button type="submit" class="action-button">Submit</button>
        <button type="button" id="extra-back-btn" class="action-button">Back</button>
      </form>
    `;

    const extraForm = document.getElementById('extra-form');
    extraForm.addEventListener('input', () => {
      const formData = {
        billNumber: document.getElementById('bill-number').value,
        extraAmount: document.getElementById('extra-amount').value,
        modePay: document.getElementById('mode-pay').value,
        itemCategory: document.getElementById('item-category').value,
      };
      localStorage.setItem('extraFormData', JSON.stringify(formData));
    });

    extraForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const billNumber = document.getElementById('bill-number').value.trim();
      const extraAmount = document.getElementById('extra-amount').value.trim();
      const modePay = document.getElementById('mode-pay').value;
      const itemCategory = document.getElementById('item-category').value.trim();

      if (!billNumber || !extraAmount || !modePay || !itemCategory) {
        alert('Please fill all fields.');
        return;
      }

      let extraData = JSON.parse(localStorage.getItem('extraData')) || [];
      extraData.push({ billNumber, extraAmount, modePay, itemCategory });
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

      let rows = data.map((item, index) => {
        if (type === 'Extra') {
          return `
            <tr>
              <td>${index + 1}</td>
              <td>${item.billNumber}</td>
              <td>${item.extraAmount}</td>
              <td>${item.modePay}</td>
              <td>${item.itemCategory}</td>
              <td><button class="delete-btn" data-index="${index}" data-type="extra">Delete</button></td>
            </tr>
          `;
        } else if (type === 'Delivery') {
          return `
            <tr>
              <td>${index + 1}</td>
              <td>${item.billNumber}</td>
              <td>${item.amount}</td>
              <td>${item.modePay}</td>
              <td><input type="checkbox" class="paid-checkbox" data-index="${index}" ${item.paid ? 'checked' : ''}></td>
              <td><button class="delete-btn" data-index="${index}" data-type="delivery">Delete</button></td>
            </tr>
          `;
        } else if (type === 'Issue') {
          return `
            <tr>
              <td>${index + 1}</td>
              <td>${item.billNumber}</td>
              <td colspan="4">${item.issueText}</td>
              <td><button class="delete-btn" data-index="${index}" data-type="issue">Delete</button></td>
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
    if (confirm('Are you sure you want to end the shift? This will clear all saved data.')) {
      localStorage.removeItem('extraData');
      localStorage.removeItem('deliveryData');
      localStorage.removeItem('issueData');
      localStorage.removeItem('appState');
      localStorage.removeItem('extraFormData');
      localStorage.removeItem('deliveryFormData');
      localStorage.removeItem('issueFormData');
      localStorage.removeItem('shiftStarted');
      alert('Shift ended and data cleared.');
      location.reload();
    }
  }
});
