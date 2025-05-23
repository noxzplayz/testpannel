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
      localStorage.setItem('shiftStartTime', new Date().toISOString());
      showUPIForm();
    });
  }

  const newShiftButton = document.querySelector('.new-shift-button');
  if (newShiftButton) {
    newShiftButton.addEventListener('click', () => {
      alert('New button clicked!');
    });
  }

  function showUPIForm() {
    mainContent.innerHTML = `
      <form id="upi-form" class="upi-form">
        <label for="upi-balance">Enter Previous UPI balance:</label><br/>
        <input type="number" id="upi-balance" name="upi-balance" required class="input-field"/><br/>
        <label><input type="checkbox" id="upi-check" name="upi-check"/> I am in counter 2</label><br/>
        <button type="submit" class="submit-button">Submit</button>
      </form>
    `;

    const upiForm = document.getElementById('upi-form');
    if (upiForm) {
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
    }
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


  const saleWithoutBillData = [
    { item: 'A4 SHEETS', price: 1.25, quantity: '1 SHEET' },
    { item: 'A4 SHEETS BUNDLE', price: 360, quantity: '500 Sheet' },
    { item: '250ML Plastic Glass', price: 0.85, quantity: '1 glass' },
    { item: 'Mixed Masala', price: 10, quantity: '1' },
    { item: 'Pan', price: 5, quantity: '1' },
    { item: '125ml Icecream Round Bowl', price: 0.65, quantity: '1' }, 
    { item: '130 ml flower ice cream bowl', price: 0.25, quantity: '1' }, 
    { item: 'plastic spoon', price: 0.70, quantity: '1' }, 
    { item: 'plastic fork', price: 0.80, quantity: '1' }, 
    { item: '750 food cointainer', price: 4, quantity: '1' }, 
    { item: '450 food cointainer', price: 3, quantity: '1' }, 
    { item: 'ezee taj tooth picks', price: 30, quantity: '1' }, 
    { item: 'classic silver pouch 8×10 (pack)', price: 110, quantity: '1' }, 
    { item: 'classic silver pouch 6×8(pack)', price: 70, quantity: '1' }, 
    { item: 'black straw(pack) ', price: 30, quantity: '1' }, 
    { item: 'sprite', price: 10, quantity: '1' }, 
    { item: 'fanta', price: 10, quantity: '1' }, 
    { item: 'coca cola', price: 10, quantity: '1' }, 
    { item: 'kinley soda', price: 10, quantity: '1' }, 
    { item: 'ice cream bowl cap', price: 1.25, quantity: '1' },  
    { item: '8 paper plate', price: 10, quantity: '1' }, 
    { item: 'Masala Kadle', price: 40, quantity: '1' }, 
    { item: 'Oil Kadle', price: 35, quantity: '1' }, 
    { item: 'Batani Kadle', price: 35, quantity: '1' }, 
    { item: 'Sweet Potato Stick', price: 40, quantity: '1' }, 
    { item: 'Puffed Channa', price: 40, quantity: '1' },
    { item: 'Mixture', price: 35, quantity: '1' },
    { item: 'Horse Gram Mixture', price: 35, quantity: '1' },
    { item: 'Puffed Channa', price: 35, quantity: '1' }, 
  ];

  function showSaleWithoutBill() {
    let selectedItems = []; // Array to store selected items
    let totalValue = 0; // Variable to store the total value

    mainContent.innerHTML = `
      <div class="sale-without-bill-container" style="max-width: 600px; margin: 40px auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); background-color: #fff; text-align: center;">
        <h2 style="margin-bottom: 20px; font-family: Arial, sans-serif; color: #333;">Choose The Extra Item To Add (Read Carefully)</h2>
        <form id="sale-search-form" style="display: flex; gap: 10px; margin-bottom: 20px;">
          <input type="text" id="sale-search-input" placeholder="Search items..." autocomplete="off" style="flex-grow: 1; padding: 10px 12px; font-size: 16px; border: 1px solid #ccc; border-radius: 4px; box-shadow: inset 0 1px 3px rgba(0,0,0,0.1);"/>
          <button type="submit" class="action-button" style="padding: 10px 20px; font-size: 16px; background-color: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">Search</button>
        </form>
        <div id="sale-search-results" style="text-align: left; max-height: 300px; overflow-y: auto;"></div>
        <button id="sale-back-btn" class="action-button" style="margin-top: 20px; padding: 10px 20px; font-size: 16px; background-color: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer;">Back</button>
      </div>
    `;

    const saleSearchForm = document.getElementById('sale-search-form');
    const saleBackBtn = document.getElementById('sale-back-btn');
    const saleSearchResults = document.getElementById('sale-search-results');

    function renderResults(results) {
      if (results.length === 0) {
        saleSearchResults.innerHTML = '<p>No items found.</p>';
        return;
      }
      let html = '<table style="width: 100%; border-collapse: collapse; cursor: pointer;">';
      html += '<thead><tr style="background-color: #007bff; color: white;">' +
              '<th style="padding: 8px; border: 1px solid #ddd;">Item</th>' +
              '<th style="padding: 8px; border: 1px solid #ddd;">Price</th>' +
              '<th style="padding: 8px; border: 1px solid #ddd;">Quantity</th>' +
              '<th style="padding: 8px; border: 1px solid #ddd;">Action</th>' +
              '</tr></thead><tbody>';
      results.forEach((row, index) => {
        html += `<tr data-index="${index}">
          <td style="padding: 8px; border: 1px solid #ddd;">${row.item}</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${row.price}</td>
          <td style="padding: 8px; border: 1px solid #ddd;">
            <input type="number" id="quantity-${index}" min="1" value="1" style="width: 60px;"/>
          </td>
          <td style="padding: 8px; border: 1px solid #ddd;">
            <button class="confirm-sale-btn" data-index="${index}" style="padding: 5px 10px; background-color: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer;">Confirm</button>
          </td>
        </tr>`;
      });
      html += '</tbody></table>';
      saleSearchResults.innerHTML = html;

      // Add click event listeners to Confirm buttons
      const confirmButtons = saleSearchResults.querySelectorAll('.confirm-sale-btn');
      confirmButtons.forEach(button => {
        button.addEventListener('click', () => {
          const index = parseInt(button.getAttribute('data-index'));
          const quantityInput = document.getElementById(`quantity-${index}`);
          const quantity = parseInt(quantityInput.value);
          const item = results[index];
          const itemTotal = Math.round(quantity * item.price); // Calculate total for the item

          // Add item to selectedItems and update totalValue
          selectedItems.push(item.item);
          totalValue += itemTotal;

          // Ask if the user has more SWB items
          const hasMoreItems = confirm(`Do You Have More Extra items?`);
          if (hasMoreItems) {
            // Allow the user to select another item
            alert(`You can now select another item.`);
          } else {
            // Send the total value and concatenated item names to the Extra Form
            const concatenatedItems = selectedItems.join(', ');
            showExtraForm({ extraAmount: totalValue, itemCategory: concatenatedItems });
          }
        });
      });
    }

    // Render all items initially
    renderResults(saleWithoutBillData);

    saleSearchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const query = document.getElementById('sale-search-input').value.trim().toLowerCase();
      if (query === '') {
        // If search is empty, show all items
        renderResults(saleWithoutBillData);
        return;
      }
      const filtered = saleWithoutBillData.filter(d => d.item.toLowerCase().includes(query));
      renderResults(filtered);
    });

    saleBackBtn.addEventListener('click', () => {
      localStorage.setItem('appState', 'shiftInProgress');
      showShiftInProgress();
    });
  }

  function showExtraForm(savedData = {}) {
    localStorage.setItem('appState', 'extraForm');
    mainContent.innerHTML = `
      <form id="extra-form" class="extra-form">
        <label><input type="checkbox" id="completely-extra" name="completely-extra" ${savedData.completelyExtra ? 'checked' : ''}/> Completely Extra</label><br/>
        
        <label for="item-category">Item Category:</label><br/>
        <div style="position: relative; display: inline-block; width: 100%;">
          <input type="text" id="item-category" name="item-category" value="${savedData.itemCategory || ''}" required class="input-field" style="padding-right: 30px;"/>
          <span id="item-category-search" style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); cursor: pointer;">
            🔍
          </span>
        </div><br/>

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

    // Add functionality to the magnifying glass
    document.getElementById('item-category-search').addEventListener('click', () => {
      showSaleWithoutBill();
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
      const extraData = JSON.parse(localStorage.getItem('extraData')) || [];
      const deliveryData = JSON.parse(localStorage.getItem('deliveryData')) || [];
      const issueData = JSON.parse(localStorage.getItem('issueData')) || [];
      const upiBalance = localStorage.getItem('upiBalance') || 'Not provided';
      const counterState = localStorage.getItem('counterState') || 'Not set';
      const shiftStartTime = new Date(localStorage.getItem('shiftStartTime')).toLocaleString() || 'Unknown';
      const shiftEndTime = new Date().toLocaleString();

      mainContent.innerHTML = `
        <div class="thank-you-container">
          <h2>Shift Analysis Summary</h2>
          <div class="analysis-summary">
            <p><strong>Shift Start Time:</strong> ${shiftStartTime}</p>
            <p><strong>Shift End Time:</strong> ${shiftEndTime}</p>
            <p><strong>UPI Balance:</strong> ${upiBalance}</p>
            <p><strong>Counter State:</strong> ${counterState}</p>
          </div>
          <div class="data-section">
            <h3>Extra Data</h3>
            ${extraData.length > 0 ? generateExtraDataSummaryTable(extraData) : '<p>No Extra Data Available</p>'}
          </div>
          <div class="data-section">
            <h3>Delivery Data</h3>
            ${deliveryData.length > 0 ? generateTable(deliveryData, ['Bill Number', 'Amount', 'Mode of Pay', 'Paid']) : '<p>No Delivery Data Available</p>'}
          </div>
          <div class="data-section">
            <h3>Issue Data</h3>
            ${issueData.length > 0 ? generateTable(issueData, ['Bill Number', 'Issue Description']) : '<p>No Issue Data Available</p>'}
          </div>
          <button id="end-shift-final" class="action-button" style="background-color: red; color: white;">End Shift</button>
        </div>
      `;

      document.getElementById('end-shift-final').addEventListener('click', () => {
        if (confirm('Are you sure you want to end the shift? All data will be cleared!')) {
          endShiftProcess();
          alert('Shift ended. All data has been cleared.');
        }
      });
    }

    function generateTable(data, headers) {
      let tableHTML = '<table class="analysis-table"><thead><tr>';
      headers.forEach(header => {
        tableHTML += `<th>${header}</th>`;
      });
      tableHTML += '</tr></thead><tbody>';
      data.forEach(row => {
        tableHTML += '<tr>';
        Object.values(row).forEach(cell => {
          tableHTML += `<td>${cell}</td>`;
        });
        tableHTML += '</tr>';
      });
      tableHTML += '</tbody></table>';
      return tableHTML;
    }

    // New function to generate Extra Data summary table without boolean values
    function generateExtraDataSummaryTable(data) {
      let tableHTML = '<table class="analysis-table"><thead><tr>';
      const headers = ['Bill Number', 'Extra Amount', 'Mode of Pay', 'Item Category'];
      headers.forEach(header => {
        tableHTML += `<th>${header}</th>`;
      });
      tableHTML += '</tr></thead><tbody>';
      data.forEach(row => {
        tableHTML += '<tr>';
        // Only include the specific fields, excluding completelyExtra boolean
        tableHTML += `<td>${row.billNumber}</td>`;
        tableHTML += `<td>${row.extraAmount}</td>`;
        tableHTML += `<td>${row.modePay}</td>`;
        tableHTML += `<td>${row.itemCategory}</td>`;
        tableHTML += '</tr>';
      });
      tableHTML += '</tbody></table>';
      return tableHTML;
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
    localStorage.clear(); // Clear all localStorage data (optional, if no other data is stored)

    // Reset the application to the initial state
    mainContent.innerHTML = `
      <div class="welcome-text">Welcome</div>
      <button class="start-shift-button">Start Shift</button>
    `;

    const startShiftButton = document.querySelector('.start-shift-button');
    if (startShiftButton) {
      startShiftButton.addEventListener('click', () => {
        // Reinitialize shift state
        localStorage.setItem('shiftStarted', 'true');
        localStorage.setItem('shiftStartTime', new Date().toISOString());
        showUPIForm();
      });
    }
  }
});
