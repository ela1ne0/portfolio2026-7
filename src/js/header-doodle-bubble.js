const LINES = [
  'let me know if this was helpful!',
  'will probably add to this...',
  'should I make a video?',
  "seriously, tell me what's confusing",
  'okay, back to building!',
];

let lineIndex = 0;
let hideTimeout = null;

const doodle = document.getElementById('hib-header-doodle');

if (doodle) {
  const bubble = document.createElement('div');
  bubble.className = 'speech-bubble hib-header-bubble';
  bubble.innerHTML = `<div class="bubble-main" id="header-doodle-bubble-text"></div>`;
  document.body.appendChild(bubble);

  const bubbleText = document.getElementById('header-doodle-bubble-text');

  function positionBubble() {
    const rect = doodle.getBoundingClientRect();
    bubble.style.position = 'fixed';
    bubble.style.top = (rect.top + rect.height / 2) + 'px';
    bubble.style.left = (rect.right + 12) + 'px';
    bubble.style.transform = 'translateY(-50%)';
  }

  // same pattern as footer-cat-bubble.js — one line per hover, advancing
  // to the next line each time, instead of auto-rotating on a timer
  function showBubble() {
    clearTimeout(hideTimeout);
    positionBubble();
    bubbleText.textContent = LINES[lineIndex];
    lineIndex = (lineIndex + 1) % LINES.length;
    bubble.classList.add('visible');
  }

  function hideBubble() {
    hideTimeout = setTimeout(() => {
      bubble.classList.remove('visible');
    }, 150);
  }

  doodle.addEventListener('mouseenter', showBubble);
  doodle.addEventListener('mouseleave', hideBubble);

  window.addEventListener('scroll', () => {
    if (bubble.classList.contains('visible')) positionBubble();
  }, { passive: true });
  window.addEventListener('resize', positionBubble);
}
