// JavaScript for Extra section form handling and data persistence

document.addEventListener('DOMContentLoaded', () => {
  const mainContent = document.getElementById('main-content');

  function showExtraForm(savedData = {}) {
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
        <button type="submit" class="submit-button">Submit</button>
        <button type="button" id="extra-back-btn" class="submit-button">Back</button>
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
