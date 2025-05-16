// JavaScript for Extra section form handling and data persistence

document.addEventListener('DOMContentLoaded', () => {
  const mainContent = document.getElementById('main-content');

  function showExtraForm(savedData = {}) {
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
        <button type="submit" class="submit-button">Submit</button>
        <button type="button" id="extra-back-btn" class="submit-button">Back</button>
      </form>
      <div id="live-totals" class="live-totals">
        <h3>Live Totals</h3>
        <p>Total UPI: <span id="total-upi">0</span></p>
        <p>Total Cash: <span id="total-cash">0</span></p>
        <p>Total Card: <span id="total-card">0</span></p>
      </div>
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

    function updateLiveTotals() {
      const extraData = JSON.parse(localStorage.getItem('extraData')) || [];
      let totalUPI = 0;
      let totalCash = 0;
      let totalCard = 0;

      extraData.forEach(item => {
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

      document.getElementById('total-upi').textContent = totalUPI.toFixed(2);
      document.getElementById('total-cash').textContent = totalCash.toFixed(2);
      document.getElementById('total-card').textContent = totalCard.toFixed(2);
    }

    // Initial update of live totals
    updateLiveTotals();

    // Update live totals when extra data is saved
    document.addEventListener('extraDataSaved', () => {
      updateLiveTotals();
    });

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

      // Save data to localStorage
      let extraData = JSON.parse(localStorage.getItem('extraData')) || [];
      extraData.push({ completelyExtra, billNumber, extraAmount, modePay, itemCategory });
      localStorage.setItem('extraData', JSON.stringify(extraData));
      localStorage.removeItem('extraFormData');

      alert('Extra data saved.');

      // Dispatch custom event to notify main app to show shift in progress
      document.dispatchEvent(new CustomEvent('extraDataSaved'));
    });

    document.getElementById('extra-back-btn').addEventListener('click', () => {
      // Dispatch custom event to notify main app to show shift in progress
      document.dispatchEvent(new CustomEvent('extraFormBack'));
    });
  }

  // Expose showExtraForm globally
  window.showExtraForm = showExtraForm;
});
