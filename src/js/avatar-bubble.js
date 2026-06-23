/**
 * avatar-bubble.js
 * Speech bubble with rotating dialogue on avatar hover
 */

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
    link: 'https://open.spotify.com/user/q0xzx8ebk5ji1hvc369yhy34q?si=39d872d4b95d4e7a' 
  },
  { 
    text: 'currently @ IBM,',
    sub: 'next: you?',
    link: null
  },
];

let currentIndex = 0;
let rotateInterval = null;

// ── Build the bubble ────────────────────────────────────────────────────────

const avatar = document.querySelector('.left-avatar');
if (!avatar) console.warn('avatar-bubble.js: .left-avatar not found');

// wrap avatar in a positioned container
const wrapper = document.createElement('div');
wrapper.className = 'avatar-wrapper';
avatar.parentNode.insertBefore(wrapper, avatar);
wrapper.appendChild(avatar);

// create bubble
const bubble = document.createElement('div');
bubble.className = 'speech-bubble';
bubble.innerHTML = `
  <div class="bubble-main" id="bubble-main"></div>
  <div class="bubble-sub"  id="bubble-sub"></div>
`;
wrapper.appendChild(bubble);

const bubbleMain = document.getElementById('bubble-main');
const bubbleSub  = document.getElementById('bubble-sub');

// ── Render a line ───────────────────────────────────────────────────────────

function renderLine(index) {
  const line = LINES[index];

  // animate out
  bubble.classList.add('switching');

  setTimeout(() => {
    bubbleMain.textContent = line.text;

    if (line.sub && line.link) {
      bubbleSub.innerHTML = `<a href="${line.link}" target="_blank" 
        rel="noopener" class="bubble-link">${line.sub}</a>`;
    } else if (line.sub) {
      bubbleSub.textContent = line.sub;
      bubbleSub.innerHTML = bubbleSub.textContent;
    } else {
      bubbleSub.textContent = '';
    }

    // animate in
    bubble.classList.remove('switching');
    bubble.classList.add('entering');
    setTimeout(() => bubble.classList.remove('entering'), 300);
  }, 150);
}

// ── Hover logic ─────────────────────────────────────────────────────────────

wrapper.addEventListener('mouseenter', () => {
  renderLine(currentIndex);
  bubble.classList.add('visible');

  // rotate every 2.2s while hovering
  rotateInterval = setInterval(() => {
    currentIndex = (currentIndex + 1) % LINES.length;
    renderLine(currentIndex);
  }, 2200);
});

wrapper.addEventListener('mouseleave', () => {
  bubble.classList.remove('visible');
  clearInterval(rotateInterval);
  rotateInterval = null;
});

// init first line so it's ready
renderLine(currentIndex);
