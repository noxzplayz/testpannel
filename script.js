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
      <marquee style="color:#b71c1c;font-weight:bold;margin-bottom:10px;">
        This application has been updated with new feature, make sure to check carefully :)
      </marquee>
      <div class="shift-status">Shift in progress</div>
      <button class="action-button" id="extra-btn">Extra</button>
      <button class="action-button" id="delivery-btn">Delivery</button>
      <button class="action-button" id="bill-paid-btn">Bill Paid</button>
      <button class="action-button" id="issue-btn">Issue</button>
      <button class="action-button" id="analysis-btn">Analysis</button>
      <button class="action-button" id="retails-btn">Retails</button>
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
    document.getElementById('bill-paid-btn').addEventListener('click', () => {
      showBillPaidForm();
    });
    document.getElementById('issue-btn').addEventListener('click', () => {
      localStorage.setItem('appState', 'issueForm');
      showIssueForm();
    });
    document.getElementById('analysis-btn').addEventListener('click', () => {
      localStorage.setItem('appState', 'analysisView');
      showAnalysis();
    });
    document.getElementById('retails-btn').addEventListener('click', () => {
      showRetailTypeForm();
    });
    document.querySelector('.end-shift-button').addEventListener('click', endShift);
  }

  // Sale Without Bill Data...
  const saleWithoutBillData = [
    // ... your data array ...
  ];

  function showSaleWithoutBill() {
    // ... existing implementation ...
  }

  function showExtraForm(savedData = {}) {
    // ... existing implementation ...
  }

  function showDeliveryForm(savedData = {}) {
    // ... existing implementation ...
  }

  function showIssueForm(savedData = {}) {
    // ... existing implementation ...
  }

  function showBillPaidForm(savedData = {}) {
    // ... existing implementation ...
  }

  function showAnalysis() {
    // ... existing implementation ...
  }

  // Updated endShift function:
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
        // ✅ FIX: Small delay allows DOM to finish updating on desktop
        setTimeout(() => {
          showThankYouInterface();
        }, 50);
      }
    }, 1000);

    cancelButton.addEventListener('click', () => {
      clearInterval(intervalId);
      localStorage.setItem('appState', 'shiftInProgress');
      showShiftInProgress();
    });
  }

  function showThankYouInterface() {
    // ... existing implementation ...
  }

  function endShiftProcess() {
    // ... existing implementation ...
  }

  function showRetailTypeForm() {
    // ... existing implementation ...
  }

  function showRetailReceivedForm() {
    // ... existing implementation ...
  }

  function showRetailGivenForm() {
    // ... existing implementation ...
  }
});
