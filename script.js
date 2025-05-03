// JavaScript functionality for Start Shift button and counters and next screens with UPI balance input, shift in progress, extra form, and data persistence with consistent styling

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM fully loaded and parsed');
  const mainContent = document.getElementById('main-content');
  const startShiftButton = document.querySelector('.start-shift-button');

  // Check if shift started
  const shiftStarted = localStorage.getItem('shiftStarted') === 'true';
  const savedState = localStorage.getItem('appState');
  const savedExtraFormData = JSON.parse(localStorage.getItem('extraFormData') || '{}');

  if (shiftStarted) {
    if (savedState === 'shiftInProgress') {
      showShiftInProgress();
    } else if (savedState === 'extraForm') {
      showExtraForm(savedExtraFormData);
    } else if (savedState === 'analysisView') {
      showAnalysis();
    } else {
      showShiftInProgress();
    }
  } else {
    // Shift not started, show home page
    if (!startShiftButton) {
      console.error('Start Shift button not found');
      return;
    }
  }

  if (startShiftButton) {
    startShiftButton.addEventListener('click', () => {
      console.log('Start Shift button clicked');
      localStorage.setItem('shiftStarted', 'true');
      localStorage.setItem('appState', 'shiftInProgress');
      // Replace main content with two counter buttons
      mainContent.innerHTML = `
        <button id="counter1" class="counter-button">Counter 1</button>
        <button id="counter2" class="counter-button">Counter 2</button>
      `;

      // Add event listeners for the counter buttons
      const counter1 = document.getElementById('counter1');
      const counter2 = document.getElementById('counter2');

      if (!counter1 || !counter2) {
        console.error('Counter buttons not found');
        return;
      }

      counter1.addEventListener('click', () => {
        console.log('Counter 1 clicked');
        // Show form to input previous UPI balance
        mainContent.innerHTML = `
          <form id="upi-form" class="upi-form">
            <label for="upi-balance">What's my previous UPI balance?</label><br/>
            <input type="number" id="upi-balance" name="upi-balance" required class="input-field"/><br/>
            <button type="submit" class="action-button">Submit</button>
          </form>
        `;

        const upiForm = document.getElementById('upi-form');
        if (!upiForm) {
          console.error('UPI form not found');
          return;
        }
        upiForm.addEventListener('submit', (e) => {
          e.preventDefault();
          console.log('UPI form submitted');
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
        console.log('Counter 2 clicked');
        alert('Counter 2 clicked');
      });
    });
  }

  function showShiftInProgress() {
    localStorage.setItem('appState', 'shiftInProgress');
    mainContent.innerHTML = `
      <div class="shift-status">Shift in progress</div>
      <button class="action-button" id="extra-btn">Extra</button>
      <button class="action-button">Delivery</button>
      <button class="action-button">Issue</button>
      <button class="action-button" id="analysis-btn">Analysis</button>
      <button class="action-button end-shift-button" id="end-shift-btn">End Shift</button>
    `;

    document.getElementById('extra-btn').addEventListener('click', () => {
      localStorage.setItem('appState', 'extraForm');
      showExtraForm();
    });
    document.querySelector('.end-shift-button').addEventListener('click', endShift);
    document.getElementById('analysis-btn').addEventListener('click', () => {
      localStorage.setItem('appState', 'analysisView');
      showAnalysis();
    });
    // Add other buttons' event listeners as needed
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
      // Save form data on input for persistence
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

      // Save data to localStorage
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

  function showAnalysis() {
    localStorage.setItem('appState', 'analysisView');
    let extraData = JSON.parse(localStorage.getItem('extraData')) || [];
    if (extraData.length === 0) {
      mainContent.innerHTML = `
        <div class="shift-status">No Extra Category Data Available</div>
        <button class="action-button" id="analysis-back-btn">Back</button>
      `;
    } else {
      let rows = extraData.map((item, index) => `
        <tr>
          <td>${index + 1}</td>
          <td>${item.billNumber}</td>
          <td>${item.extraAmount}</td>
          <td>${item.modePay}</td>
          <td>${item.itemCategory}</td>
        </tr>
      `).join('');

      mainContent.innerHTML = `
        <div class="shift-status">View Extra Category</div>
        <table class="extra-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Bill Number</th>
              <th>Extra Amount</th>
              <th>Mode of Pay</th>
              <th>Item Category</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
        <button class="action-button" id="analysis-back-btn">Back</button>
      `;
    }
    document.getElementById('analysis-back-btn').addEventListener('click', () => {
      localStorage.setItem('appState', 'shiftInProgress');
      showShiftInProgress();
    });
  }

  function endShift() {
    if (confirm('Are you sure you want to end the shift? This will clear all saved data.')) {
      localStorage.removeItem('extraData');
      localStorage.removeItem('appState');
      localStorage.removeItem('extraFormData');
      localStorage.removeItem('shiftStarted');
      alert('Shift ended and data cleared.');
      location.reload();
    }
  }
});
