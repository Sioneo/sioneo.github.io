document.addEventListener('DOMContentLoaded', () => {
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('toggle-btn')) {
      const button = e.target;
      const box = button.closest('.box');
      const hiddenBox = box.querySelector('.hiddenbox');

      if (hiddenBox) {
        const isHidden = window.getComputedStyle(hiddenBox).display === 'none';
        hiddenBox.style.display = isHidden ? 'block' : 'none';
        button.textContent = isHidden ? '−' : '+';
      }
    }
  });
});