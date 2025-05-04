document.addEventListener('DOMContentLoaded', () => {
  // Quick Add form container will be injected inside the extra form area
  const quickAddFormHTML = `
    <div id="quick-add-form" style="display:none; margin-top:20px; padding:15px; border:1px solid #9b00e8; border-radius:12px; background:rgba(155,0,232,0.1); max-width:360px;">
      <h3>Quick Add</h3>
      <label for="bill-number-quick">Bill Number:</label><br/>
      <input type="text" id="bill-number-quick" class="input-field" /><br/>
      <label for="total-amount">Total Amount (with extra):</label><br/>
      <input type="number" id="total-amount" class="input-field" /><br/>
      <label for="without-extra-amount">Amount Without Extra:</label><br/>
      <input type="number" id="without-extra-amount" class="input-field" /><br/>
      <label for="extra-amount-quick">Extra Amount:</label><br/>
      <input type="number" id="extra-amount-quick" class="input-field" readonly /><br/>
      <label for="mode-pay-quick">Mode of Pay:</label><br/>
      <select id="mode-pay-quick" class="input-field">
        <option value="">Select</option>
        <option value="UPI">UPI</option>
        <option value="Cash">Cash</option>
        <option value="Card">Card</option>
      </select><br/>
      <label for="item-category-quick">Item Category:</label><br/>
      <input type="text" id="item-category-quick" class="input-field" /><br/>
      <button type="button" id="submit-quick-add" class="action-button">Submit</button>
      <button type="button" id="cancel-quick-add" class="action-button">Cancel</button>
    </div>
  `;

  // Append quick add form inside the extra form container
  const extraFormContainer = document.querySelector('.extra-form');
  if (extraFormContainer) {
    extraFormContainer.insertAdjacentHTML('beforeend', quickAddFormHTML);
  }

  const quickAddBtn = document.getElementById('quick-add-btn');
  const quickAddForm = document.getElementById('quick-add-form');
  const billNumberQuickInput = document.getElementById('bill-number-quick');
  const totalAmountInput = document.getElementById('total-amount');
  const withoutExtraAmountInput = document.getElementById('without-extra-amount');
  const extraAmountQuickInput = document.getElementById('extra-amount-quick');
  const modePayQuickSelect = document.getElementById('mode-pay-quick');
  const itemCategoryQuickInput = document.getElementById('item-category-quick');
  const submitQuickAddBtn = document.getElementById('submit-quick-add');
  const cancelQuickAddBtn = document.getElementById('cancel-quick-add');

  if (quickAddBtn) {
    quickAddBtn.addEventListener('click', () => {
      if (quickAddForm.style.display === 'none' || quickAddForm.style.display === '') {
        quickAddForm.style.display = 'block';
      } else {
        quickAddForm.style.display = 'none';
      }
    });
  }

  function calculateExtraAmount() {
    const total = parseFloat(totalAmountInput.value);
    const withoutExtra = parseFloat(withoutExtraAmountInput.value);
    if (isNaN(total) || isNaN(withoutExtra)) {
      extraAmountQuickInput.value = '';
      return;
    }
    const calculatedExtraAmount = total - withoutExtra;
    if (calculatedExtraAmount < 0) {
      alert('Calculated extra amount cannot be negative.');
      extraAmountQuickInput.value = '';
      return;
    }
    extraAmountQuickInput.value = calculatedExtraAmount.toFixed(2);
  }

  totalAmountInput.addEventListener('input', calculateExtraAmount);
  withoutExtraAmountInput.addEventListener('input', calculateExtraAmount);

  submitQuickAddBtn.addEventListener('click', () => {
    const billNumber = billNumberQuickInput.value.trim();
    const totalAmount = totalAmountInput.value.trim();
    const withoutExtraAmount = withoutExtraAmountInput.value.trim();
    const extraAmount = extraAmountQuickInput.value.trim();
    const modePay = modePayQuickSelect.value;
    const itemCategory = itemCategoryQuickInput.value.trim();

    if (!billNumber || !totalAmount || !withoutExtraAmount || !extraAmount || !modePay || !itemCategory) {
      alert('Please fill all fields in Quick Add form.');
      return;
    }

    let extraData = JSON.parse(localStorage.getItem('extraData')) || [];
    extraData.push({
      completelyExtra: false,
      billNumber,
      extraAmount,
      modePay,
      itemCategory
    });
    localStorage.setItem('extraData', JSON.stringify(extraData));
    alert('Quick Add data saved.');

    quickAddForm.style.display = 'none';
    billNumberQuickInput.value = '';
    totalAmountInput.value = '';
    withoutExtraAmountInput.value = '';
    extraAmountQuickInput.value = '';
    modePayQuickSelect.value = '';
    itemCategoryQuickInput.value = '';
  });

  cancelQuickAddBtn.addEventListener('click', () => {
    quickAddForm.style.display = 'none';
    billNumberQuickInput.value = '';
    totalAmountInput.value = '';
    withoutExtraAmountInput.value = '';
    extraAmountQuickInput.value = '';
    modePayQuickSelect.value = '';
