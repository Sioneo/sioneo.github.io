document.addEventListener('click', (e) => {
  if (e.target.classList.contains('toggle-btn')) {
    const button = e.target;
    const box = button.closest('.box');
    const hiddenBox = box.nextElementSibling;

    if (hiddenBox.classList.contains('hiddenbox')) {
      const isHidden = hiddenBox.style.display === 'none';
      hiddenBox.style.display = isHidden ? 'block' : 'none';
      button.textContent = isHidden ? '−' : '+';
    }
  }
});