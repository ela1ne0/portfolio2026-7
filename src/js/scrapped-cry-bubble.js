const LINES = [
  { text: 'rip', sub: null, link: null },
  { text: "interesting to see what could've been", sub: null, link: null },
  { text: "it's like seeing an ex", sub: 'no hard feelings though', link: null },
  { text: 'we had a good run', sub: null, link: null },
  { text: 'onto better things', sub: null, link: null },
];

let currentIndex = 0;
let hideTimeout = null;

const trigger = document.querySelector('#hib-cry');
if (!trigger) console.warn('scrapped-cry-bubble.js: #hib-cry not found');

// ── Build bubble and append to BODY, reusing the .speech-bubble styling ──
const bubble = document.createElement('div');
bubble.className = 'speech-bubble hib-cry-bubble';
bubble.innerHTML = `
  <div class="bubble-main" id="cry-bubble-main"></div>
  <div class="bubble-sub"  id="cry-bubble-sub"></div>
`;
document.body.appendChild(bubble);

const bubbleMain = document.getElementById('cry-bubble-main');
const bubbleSub  = document.getElementById('cry-bubble-sub');

// ── Position bubble relative to the illustration using getBoundingClientRect ──
function positionBubble() {
  if (!trigger) return;
  const rect = trigger.getBoundingClientRect();
  bubble.style.position = 'fixed';
  bubble.style.top  = (rect.top + rect.height / 2) + 'px';
  bubble.style.left = (rect.right + 12) + 'px';
  bubble.style.transform = 'translateY(-50%)';
}

function renderLine(index) {
  const line = LINES[index];
  bubbleMain.textContent = line.text;
  if (line.sub && line.link) {
    bubbleSub.innerHTML = `<a href="${line.link}" target="_blank"
      rel="noopener" class="bubble-link">${line.sub}</a>`;
  } else if (line.sub) {
    bubbleSub.textContent = line.sub;
  } else {
    bubbleSub.textContent = '';
  }
}

// ── Hover: same pattern as footer-cat-bubble.js — one line per hover,
// advancing to the next line each time, instead of auto-rotating on a timer ──
function showBubble() {
  clearTimeout(hideTimeout);
  positionBubble();
  renderLine(currentIndex);
  currentIndex = (currentIndex + 1) % LINES.length;
  bubble.classList.add('visible');
  if (trigger) trigger.classList.add('hib-cry--active');
}

function hideBubble() {
  if (trigger) trigger.classList.remove('hib-cry--active');
  hideTimeout = setTimeout(() => {
    bubble.classList.remove('visible');
  }, 150);
}

if (trigger) {
  trigger.addEventListener('mouseenter', showBubble);
  trigger.addEventListener('mouseleave', hideBubble);
}

window.addEventListener('scroll', () => {
  if (bubble.classList.contains('visible')) positionBubble();
}, { passive: true });
window.addEventListener('resize', positionBubble);

// small intro wiggle on load, matching the .sweat-drop pattern used elsewhere on the site
if (trigger) {
  setTimeout(() => trigger.classList.add('intro-slide'), 600);
  setTimeout(() => trigger.classList.remove('intro-slide'), 1500);
}
