// JavaScript functionality for Start Shift button and counters and next screens with UPI balance input and shift in progress

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM fully loaded and parsed');
  const mainContent = document.getElementById('main-content');
  const startShiftButton = document.querySelector('.start-shift-button');

  if (!startShiftButton) {
    console.error('Start Shift button not found');
    return;
  }

  startShiftButton.addEventListener('click', () => {
    console.log('Start Shift button clicked');
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
          <input type="number" id="upi-balance" name="upi-balance" required /><br/>
          <button type="submit" class="submit-button">Submit</button>
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
        // Show shift in progress interface
        mainContent.innerHTML = `
          <div class="shift-status">Shift in progress</div>
          <button class="action-button">Extra</button>
          <button class="action-button">Delivery</button>
          <button class="action-button">Issue</button>
          <button class="action-button">Analysis</button>
          <button class="action-button">End Shift</button>
        `;

        // Add event listeners for these buttons
        const buttons = mainContent.querySelectorAll('.action-button');
        buttons.forEach(button => {
          button.addEventListener('click', () => {
            console.log(button.textContent + ' clicked');
            alert(button.textContent + ' clicked');
          });
        });
      });
    });

    counter2.addEventListener('click', () => {
      console.log('Counter 2 clicked');
      alert('Counter 2 clicked');
    });
  });
});
