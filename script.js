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
      mainContent.innerHTML = `
        <form id="upi-form" class="upi-form">
          <label for="upi-balance">Enter Previous UPI balance.</label><br/>
          <input type="number" id="upi-balance" name="upi-balance" required class="input-field"/><br/>
          <label><input type="checkbox" id="upi-check" name="upi-check"/> I am in counter 2</label><br/>
          <button type="submit" class="submit-button">Submit</button>
        </form>
      `;
      const upiCheckBox = mainContent.querySelector('#upi-check');
      const upiBalanceInput = mainContent.querySelector('#upi-balance');
      if (upiCheckBox && upiBalanceInput) {
        upiCheckBox.addEventListener('change', () => {
          if (upiCheckBox.checked) {
            upiBalanceInput.disabled = true;
            upiBalanceInput.required = false;
            upiBalanceInput.value = '';
          } else {
            upiBalanceInput.disabled = false;
            upiBalanceInput.required = true;
          }
        });
      }

      const upiForm = document.getElementById('upi-form');
      if (!upiForm) return;
      upiForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const upiBalanceInput = document.getElementById('upi-balance');
        const upiBalance = upiBalanceInput.value;
        const upiCheck = document.getElementById('upi-check').checked;
        if (!upiCheck && upiBalance.trim() === '') {
          alert('Please enter your previous UPI balance or check the box.');
          upiBalanceInput.focus();
          return;
        }
        // Save UPI balance and counter state
        localStorage.setItem('upiBalance', upiBalance);
        localStorage.setItem('counterState', upiCheck ? '2' : '1');
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
        </select><br/>
        <label for="item-category">Item Category:</label><br/>
        <input type="text" id="item-category" name="item-category" value="${savedData.itemCategory || ''}" required class="input-field"/><br/>
        <button type="submit" class="action-button">Submit</button>
        <button type="button" id="extra-back-btn" class="action-button">Back</button>
      </form>
    `;

    const extraForm = document.getElementById('extra-form');
    const completelyExtraCheckbox = document.getElementById('completely-extra');
    const billNumberInput = document.getElementById('bill-number');

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
        extraAmount: document.getElementById('extra-amount').value,
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
        extraAmount: document.getElementById('extra-amount').value,
        modePay: document.getElementById('mode-pay').value,
        itemCategory: document.getElementById('item-category').value,
      };
      localStorage.setItem('extraFormData', JSON.stringify(formData));
    });

    extraForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const completelyExtra = completelyExtraCheckbox.checked;
      const billNumber = billNumberInput.value.trim();
      const extraAmount = document.getElementById('extra-amount').value.trim();
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

      let extraData = JSON.parse(localStorage.getItem('extraData')) || [];
      extraData.push({ completelyExtra, billNumber, extraAmount, modePay, itemCategory });
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
    let upiBalance = localStorage.getItem('upiBalance') || '';
    let counterState = localStorage.getItem('counterState') || '';

    mainContent.innerHTML = `
      <div class="shift-status analysis-title">Analysis</div>
      <div class="analysis-tabs">
        <button class="tab-button" id="tab-extra">View Extra</button>
        <button class="tab-button" id="tab-delivery">View Delivery</button>
        <button class="tab-button" id="tab-issue">View Issue</button>
        <button class="tab-button" id="tab-upi">View UPI Balance</button>
      </div>
      <div id="filter-container" class="filter-container"></div>
      <div id="analysis-content"></div>
      <button class="action-button" id="analysis-back-btn">Back</button>
    `;

    const analysisContent = document.getElementById('analysis-content');
    const filterContainer = document.getElementById('filter-container');

    function renderLiveTotals(data) {
      let totalUPI = 0;
      let totalCash = 0;
      let totalCard = 0;

      data.forEach(item => {
        const amount = parseFloat(item.extraAmount) || 0;
        switch (item.modePay) {
          case 'UPI':
            totalUPI += amount;
            break;
          case 'Cash':
            totalCash += amount;
            break;
          case 'Card':
            totalCard += amount;
            break;
        }
      });

      return `
        <div class="live-totals">
          <h3>Live Totals</h3>
          <p>Total UPI: ${totalUPI.toFixed(2)}</p>
          <p>Total Cash: ${totalCash.toFixed(2)}</p>
          <p>Total Card: ${totalCard.toFixed(2)}</p>
        </div>
      `;
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
              <td>${item.completelyExtra ? 'CE' : item.billNumber}</td>
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
        ${type === 'Extra' ? renderLiveTotals(extraData) : ''}
      `;

      // Add delete button event listeners
      const deleteButtons = analysisContent.querySelectorAll('.delete-btn');
      deleteButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          if (confirm('Do you want to delete this entry?')) {
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

    document.getElementById('tab-upi').addEventListener('click', () => {
      filterContainer.innerHTML = '';
      analysisContent.innerHTML = `
        <div>
          <h3>UPI Balance and Counter State</h3>
          <p>UPI Balance: ${upiBalance ? upiBalance : 'Not provided'}</p>
          <p>Counter State: ${counterState ? counterState : 'Not set'}</p>
        </div>
      `;
    });

    document.getElementById('analysis-back-btn').addEventListener('click', () => {
      localStorage.setItem('appState', 'shiftInProgress');
      showShiftInProgress();
    });
  }

function endShift() {
  // Show countdown interface
  let countdown = 10;
  mainContent.innerHTML = `
    <div class="countdown-container">
      <h2>Ending Shift in <span id="countdown-timer">${countdown}</span> seconds</h2>
      <button id="cancel-end-shift" class="action-button">Cancel</button>
    </div>
  `;

  const countdownTimer = document.getElementById('countdown-timer');
  const cancelButton = document.getElementById('cancel-end-shift');

  const intervalId = setInterval(() => {
    countdown--;
    countdownTimer.textContent = countdown;
    if (countdown <= 0) {
      clearInterval(intervalId);
      showThankYouInterface();
    }
  }, 1000);

  cancelButton.addEventListener('click', () => {
    clearInterval(intervalId);
    localStorage.setItem('appState', 'shiftInProgress');
    showShiftInProgress();
  });

  function showThankYouInterface() {
    mainContent.innerHTML = `
      <div class="thank-you-container">
        <h2>Thank You!</h2>
        <button id="download-analysis" class="action-button">Download Analysis</button>
        <div id="confirmation-container" style="display: none; margin-top: 20px;">
          <p style="color: red;">Are you sure you want to end the shift? All data will be cleared!</p>
          <button id="confirm-end-shift" class="action-button">Yes, End Shift</button>
          <button id="cancel-end-shift" class="action-button">Cancel</button>
        </div>
      </div>
    `;

    document.getElementById('download-analysis').addEventListener('click', () => {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();

      // Prepare data for PDF
      const extraData = JSON.parse(localStorage.getItem('extraData')) || [];
      const deliveryData = JSON.parse(localStorage.getItem('deliveryData')) || [];
      const issueData = JSON.parse(localStorage.getItem('issueData')) || [];
      const upiBalance = localStorage.getItem('upiBalance') || 'Not provided';
      const counterState = localStorage.getItem('counterState') || 'Not set';
      const shiftStartTime = new Date(localStorage.getItem('shiftStartTime')).toLocaleString() || 'Unknown';
      const shiftEndTime = new Date().toLocaleString();

      // Save shift end time
      localStorage.setItem('shiftEndTime', shiftEndTime);

      // Add a styled header
      doc.setFontSize(22);
      doc.setTextColor(40, 40, 40);
      doc.text('Shift Analysis Report', 105, 20, { align: 'center' });

      // Add a horizontal line below the header
      doc.setDrawColor(0, 0, 0);
      doc.line(10, 25, 200, 25);

      // Add shift details
      doc.setFontSize(12);
      doc.setTextColor(60, 60, 60);
      doc.text(`Shift Start Time: ${shiftStartTime}`, 14, 35);
      doc.text(`Shift End Time: ${shiftEndTime}`, 14, 42);
      doc.text(`UPI Balance: ${upiBalance}`, 14, 49);
      doc.text(`Counter State: ${counterState}`, 14, 56);

      // Add tables for Extra Data, Delivery Data, and Issue Data
      let currentY = 64;

      // Extra Data Table
      if (extraData.length > 0) {
        currentY = addTable(
          doc,
          'Extra Data',
          ['Bill Number', 'Extra Amount', 'Mode of Pay', 'Item Category'],
          extraData.map(item => [
            item.completelyExtra ? 'CE' : item.billNumber,
            item.extraAmount,
            item.modePay,
            item.itemCategory
          ]),
          currentY
        );
      }

      // Delivery Data Table
      if (deliveryData.length > 0) {
        currentY = addTable(
          doc,
          'Delivery Data',
          ['Bill Number', 'Amount', 'Mode of Pay', 'Paid'],
          deliveryData.map(item => [
            item.billNumber,
            item.amount,
            item.modePay,
            item.paid ? 'Yes' : 'No'
          ]),
          currentY
        );
      }

      // Issue Data Table
      if (issueData.length > 0) {
        currentY = addTable(
          doc,
          'Issue Data',
          ['Bill Number', 'Issue Description'],
          issueData.map(item => [
            item.billNumber,
            item.issueText
          ]),
          currentY
        );
      }

      // Add footer
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text('Generated by Namma Mart Employee Portal', 105, 290, { align: 'center' });

      // Open the PDF in a new tab
      const pdfBlob = doc.output('blob');
      const pdfUrl = URL.createObjectURL(pdfBlob);
      window.open(pdfUrl, '_blank');

      // Show confirmation container
      document.getElementById('confirmation-container').style.display = 'block';
    });

    // Handle confirmation to end shift
    document.getElementById('confirm-end-shift').addEventListener('click', () => {
      endShiftProcess();
      alert('Shift ended. All data has been cleared.');
    });

    // Handle cancellation of end shift
    document.getElementById('cancel-end-shift').addEventListener('click', () => {
      document.getElementById('confirmation-container').style.display = 'none';
    });
  }
}

function addTable(doc, title, headers, data, startY) {
  doc.setFontSize(14);
  doc.setTextColor(40, 40, 40);
  doc.text(title, 14, startY);
  doc.setFontSize(10);

  const tableStartY = startY + 6;
  const rowHeight = 8;
  const pageWidth = 200; // Total width of the page (excluding margins)
  const colWidths = headers.map(() => pageWidth / headers.length); // Dynamically calculate column widths
  let y = tableStartY;

  // Draw table headers
  doc.setFillColor(0, 0, 0); // Black background for headers
  doc.setTextColor(255, 255, 255); // White text for headers
  headers.forEach((header, i) => {
    doc.rect(10 + i * colWidths[i], y, colWidths[i], rowHeight, 'F'); // Fill the header background
    doc.text(header, 12 + i * colWidths[i], y + 6); // Add header text with padding
  });
  y += rowHeight;

  // Draw table rows
  doc.setTextColor(60, 60, 60); // Gray text for data
  data.forEach(row => {
    row.forEach((cell, i) => {
      doc.rect(10 + i * colWidths[i], y, colWidths[i], rowHeight); // Draw cell borders
      doc.text(String(cell), 12 + i * colWidths[i], y + 6); // Add cell text with padding
    });
    y += rowHeight;
  });

  return y + 10; // Add spacing after the table
}

function endShiftProcess() {
  // Clear all shift-related data from localStorage
  localStorage.removeItem('shiftStarted');
  localStorage.removeItem('appState');
  localStorage.removeItem('extraData');
  localStorage.removeItem('deliveryData');
  localStorage.removeItem('issueData');
  localStorage.removeItem('upiBalance');
  localStorage.removeItem('counterState');
  localStorage.removeItem('shiftStartTime');
  localStorage.removeItem('shiftEndTime');

  // Reset the application to the initial state
  mainContent.innerHTML = `
    <div class="welcome-text">Welcome</div>
    <button class="start-shift-button">Start Shift</button>
  `;

  const startShiftButton = document.querySelector('.start-shift-button');
  if (startShiftButton) {
    startShiftButton.addEventListener('click', () => {
      localStorage.setItem('shiftStarted', 'true');
      showUPIForm();
    });
  }
}
});
