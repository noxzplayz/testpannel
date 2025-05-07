document.addEventListener('DOMContentLoaded', () => {
  const billingBtn = document.getElementById('billing-portal-btn');
  const deliveryBtn = document.getElementById('delivery-portal-btn');
  const billingCard = document.getElementById('billing-portal-card');
  const deliveryCard = document.getElementById('delivery-portal-card');

  function handleClick(portalName) {
    alert(portalName + ' clicked. Implement navigation or functionality here.');
  }

  if (billingBtn) {
    billingBtn.addEventListener('click', () => handleClick('Billing Portal'));
  }
  if (deliveryBtn) {
    deliveryBtn.addEventListener('click', () => handleClick('Delivery Portal'));
  }
  if (billingCard) {
    billingCard.addEventListener('click', () => handleClick('Billing Portal'));
  }
  if (deliveryCard) {
    deliveryCard.addEventListener('click', () => handleClick('Delivery Portal'));
  }
});
