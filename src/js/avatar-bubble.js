const LINES = [
  { 
    text: 'please hire me', 
    sub: 'looking for summer 2027 opportunities',
    link: null
  },
  { 
    text: 'yes, I drew everything', 
    sub: null,
    link: null
  },
  { 
    text: 'I also make playlists',
    sub: 'open spotify ↗',
    link: 'https://open.spotify.com'
  },
  { 
    text: 'currently @ibm,',
    sub: 'next: you?',
    link: null
  },
];

let currentIndex = 0;
let rotateInterval = null;

const avatar = document.querySelector('.left-avatar');
if (!avatar) console.warn('avatar-bubble.js: .left-avatar not found');

// ── Build bubble and append to BODY not to wrapper ──
const bubble = document.createElement('div');
bubble.className = 'speech-bubble';
bubble.innerHTML = `
  <div class="bubble-main" id="bubble-main"></div>
  <div class="bubble-sub"  id="bubble-sub"></div>
`;
document.body.appendChild(bubble);

const bubbleMain = document.getElementById('bubble-main');
const bubbleSub  = document.getElementById('bubble-sub');

// ── Position bubble relative to avatar using getBoundingClientRect ──
function positionBubble() {
  const rect = avatar.getBoundingClientRect();
  // position to the right of avatar, vertically centered
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
if (avatar) {
  avatar.addEventListener('mouseenter', () => {
    positionBubble();
    renderLine(currentIndex);
    bubble.classList.add('visible');
    rotateInterval = setInterval(() => {
      currentIndex = (currentIndex + 1) % LINES.length;
      renderLine(currentIndex);
    }, 2200);
  });

  avatar.addEventListener('mouseleave', () => {
    bubble.classList.remove('visible');
    clearInterval(rotateInterval);
    rotateInterval = null;
  });
}

// reposition on scroll/resize so it stays attached to avatar
window.addEventListener('scroll',  positionBubble, { passive: true });
window.addEventListener('resize',  positionBubble);

renderLine(currentIndex);
