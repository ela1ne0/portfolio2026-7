const LINES = [
  { text: 'rip', sub: null, link: null },
  { text: "interesting to see what could've been", sub: null, link: null },
  { text: "it's like seeing an ex", sub: 'no hard feelings though', link: null },
  { text: 'we had a good run', sub: null, link: null },
  { text: 'onto better things', sub: null, link: null },
];

let currentIndex = 0;
let rotateInterval = null;

const trigger = document.querySelector('#hib-cry');
if (!trigger) console.warn('scrapped-cry-bubble.js: #hib-cry not found');

// ── Build bubble and append to BODY, reusing the .speech-bubble styling ──
const bubble = document.createElement('div');
bubble.className = 'speech-bubble';
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

// ── Render a line ──
function renderLine(index) {
  const line = LINES[index];
  bubble.classList.add('switching');
  setTimeout(() => {
    bubbleMain.textContent = line.text;
    if (line.sub && line.link) {
      bubbleSub.innerHTML = `<a href="${line.link}" target="_blank"
        rel="noopener" class="bubble-link">${line.sub}</a>`;
    } else if (line.sub) {
      bubbleSub.textContent = line.sub;
    } else {
      bubbleSub.textContent = '';
    }
    bubble.classList.remove('switching');
    bubble.classList.add('entering');
    setTimeout(() => bubble.classList.remove('entering'), 300);
  }, 150);
}

// ── Hover ──
let hideTimeout = null;

function showBubble() {
  clearTimeout(hideTimeout);
  positionBubble();
  currentIndex = 0;
  renderLine(currentIndex);
  bubble.classList.add('visible');
  if (trigger) trigger.classList.add('hib-cry--active');
  if (!rotateInterval) {
    rotateInterval = setInterval(() => {
      currentIndex = (currentIndex + 1) % LINES.length;
      renderLine(currentIndex);
    }, 2200);
  }
}

function hideBubble() {
  if (trigger) trigger.classList.remove('hib-cry--active');
  hideTimeout = setTimeout(() => {
    bubble.classList.remove('visible');
    clearInterval(rotateInterval);
    rotateInterval = null;
  }, 150);
}

if (trigger) {
  trigger.addEventListener('mouseenter', showBubble);
  trigger.addEventListener('mouseleave', hideBubble);
}

bubble.addEventListener('mouseenter', showBubble);
bubble.addEventListener('mouseleave', hideBubble);

// reposition on scroll/resize so it stays attached to the illustration
window.addEventListener('scroll', positionBubble, { passive: true });
window.addEventListener('resize', positionBubble);

// small intro wiggle on load, matching the .sweat-drop pattern used elsewhere on the site
if (trigger) {
  setTimeout(() => trigger.classList.add('intro-slide'), 600);
  setTimeout(() => trigger.classList.remove('intro-slide'), 1500);
}
