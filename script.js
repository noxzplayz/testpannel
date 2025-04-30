/* filepath: c:\Users\yocha\OneDrive\Desktop\APP\script.js */

// Object to store the data
const shiftData = {};

// Function to update the date and time every second
function updateDateTime() {
    const dateTimeTextView = document.getElementById('dateTimeTextView');
    const currentDateTime = new Date();
    dateTimeTextView.textContent = currentDateTime.toLocaleString();
}

// Update the date and time every second
setInterval(updateDateTime, 1000);

// Show the modal when "Start Shift" is clicked
document.getElementById('startShiftButton').addEventListener('click', () => {
    const modal = document.getElementById('counterModal');
    modal.style.display = 'flex'; // Show the modal
});

// Handle button clicks inside the counter selection modal
document.getElementById('counter1Button').addEventListener('click', () => {
    shiftData.counter = 'Counter 1'; // Save counter selection
    closeModal('counterModal');
    const denominationModal = document.getElementById('denominationModal');
    denominationModal.style.display = 'flex'; // Show the denomination modal
});

document.getElementById('counter2Button').addEventListener('click', () => {
    shiftData.counter = 'Counter 2'; // Save counter selection
    alert('Counter 2 selected!');
    closeModal('counterModal');
});

// Handle live calculation in the denomination form
const inputs = document.querySelectorAll('#denominationForm input');
inputs.forEach(input => {
    input.addEventListener('input', calculateTotal);
});

function calculateTotal() {
    const notes500 = parseInt(document.getElementById('notes500').value) || 0;
    const notes200 = parseInt(document.getElementById('notes200').value) || 0;
    const notes100 = parseInt(document.getElementById('notes100').value) || 0;
    const notes20 = parseInt(document.getElementById('notes20').value) || 0;
    const notes10 = parseInt(document.getElementById('notes10').value) || 0;
    const coins5 = parseInt(document.getElementById('coins5').value) || 0;
    const remainingCoins = parseInt(document.getElementById('remainingCoins').value) || 0;

    const total = (notes500 * 500) + (notes200 * 200) + (notes100 * 100) +
                  (notes20 * 20) + (notes10 * 10) + (coins5 * 5) + remainingCoins;

    document.getElementById('totalValue').textContent = total;

    // Save the note counts and total to shiftData
    shiftData.notes = {
        notes500,
        notes200,
        notes100,
        notes20,
        notes10,
        coins5,
        remainingCoins,
        total
    };
}

// Handle form submission for denomination
document.getElementById('submitDenomination').addEventListener('click', () => {
    closeModal('denominationModal');
    const upiPaymentModal = document.getElementById('upiPaymentModal');
    upiPaymentModal.style.display = 'flex'; // Show the UPI payment modal
});

// Handle UPI payment submission
document.getElementById('submitUPI').addEventListener('click', () => {
    const upiAmount = parseInt(document.getElementById('upiAmount').value) || 0;

    // Save UPI payment to shiftData
    shiftData.upiPayment = upiAmount;

    // Log the shift data to the console (or send it to a server)
    console.log('Shift Data:', shiftData);

    // Close the UPI payment modal
    closeModal('upiPaymentModal');

    // Redirect to the shift page
    window.location.href = 'shift.html';
});

// Function to close a modal
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'none'; // Hide the modal
}

// Initialize the date and time on page load
updateDateTime();

// Initialize data from localStorage
const extraData = JSON.parse(localStorage.getItem('extraData')) || [];

// Ensure the DOM is fully loaded before attaching event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Show the Extra modal
    document.getElementById('extraButton').addEventListener('click', () => {
        const extraModal = document.getElementById('extraModal');
        extraModal.style.display = 'flex'; // Show the modal
    });

    // Close the Extra modal
    document.getElementById('closeExtraButton').addEventListener('click', () => {
        const extraModal = document.getElementById('extraModal');
        extraModal.style.display = 'none'; // Hide the modal
    });

    // Save Extra data
    const saveExtraButton = document.getElementById('saveExtraButton');
    if (saveExtraButton) {
        saveExtraButton.addEventListener('click', () => {
            const billNumber = document.getElementById('billNumber').value;
            const extraAmount = parseFloat(document.getElementById('extraAmount').value) || 0;
            const paymentMethod = document.getElementById('paymentMethod').value;
            const itemCategory = document.getElementById('itemCategory').value;

            if (!billNumber || !extraAmount || !paymentMethod || !itemCategory) {
                alert('Please fill all fields!');
                return;
            }

            // Save data to localStorage
            const extraData = JSON.parse(localStorage.getItem('extraData')) || [];
            const newEntry = { billNumber, extraAmount, paymentMethod, itemCategory };
            extraData.push(newEntry);
            localStorage.setItem('extraData', JSON.stringify(extraData));

            alert('Extra details saved successfully!');

            // Clear the form
            document.getElementById('extraForm').reset();
        });
    }
});

// Show Extra data in Analysis
document.getElementById('viewExtraButton').addEventListener('click', () => {
    const data = JSON.parse(localStorage.getItem('extraData')) || [];
    if (data.length === 0) {
        alert('No Extra data available.');
        return;
    }

    let message = 'Extra Data:\n';
    data.forEach((entry, index) => {
        message += `\nEntry ${index + 1}:\n`;
        message += `Bill Number: ${entry.billNumber}\n`;
        message += `Extra Amount: ₹${entry.extraAmount}\n`;
        message += `Payment Method: ${entry.paymentMethod}\n`;
        message += `Item Category: ${entry.itemCategory}\n`;
    });

    alert(message);
});