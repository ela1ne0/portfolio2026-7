const trigger = document.querySelector('#hib-fav-trigger');
if (!trigger) console.warn('fav-illustration-popup.js: #hib-fav-trigger not found');

// ── Build popup and append to BODY, positioned via getBoundingClientRect ──
const popup = document.createElement('div');
popup.className = 'hib-fav-popup';
popup.innerHTML = `<img src="/fav-illustration.png" alt="Elaine's favorite hand-drawn illustration from the portfolio — a girl sitting beside a train-station-style 'About' booth" />`;
document.body.appendChild(popup);

let hideTimeout = null;

function positionPopup() {
  if (!trigger) return;
  const rect = trigger.getBoundingClientRect();
  popup.style.top = (rect.top + rect.height / 2) + 'px';
  popup.style.left = (rect.right + 14) + 'px';
}

function showPopup() {
  clearTimeout(hideTimeout);
  positionPopup();
  popup.classList.add('visible');
}

function hidePopup() {
  hideTimeout = setTimeout(() => {
    popup.classList.remove('visible');
  }, 150);
}

if (trigger) {
  trigger.addEventListener('mouseenter', showPopup);
  trigger.addEventListener('mouseleave', hidePopup);
}

window.addEventListener('scroll', () => {
  if (popup.classList.contains('visible')) positionPopup();
}, { passive: true });
window.addEventListener('resize', positionPopup);
