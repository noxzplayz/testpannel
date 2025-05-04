document.addEventListener('DOMContentLoaded', () => {
  const copyButton = document.getElementById('copy-pdf-url-button');
  const pdfUrlInput = document.getElementById('pdf-url');

  copyButton.addEventListener('click', () => {
    pdfUrlInput.select();
    pdfUrlInput.setSelectionRange(0, 99999); // For mobile devices

    try {
      const successful = document.execCommand('copy');
      if (successful) {
        copyButton.textContent = 'Copied!';
        setTimeout(() => {
          copyButton.textContent = 'Copy URL';
        }, 2000);
      } else {
        alert('Failed to copy URL. Please copy manually.');
      }
    } catch (err) {
      alert('Failed to copy URL. Please copy manually.');
    }
  });
});
