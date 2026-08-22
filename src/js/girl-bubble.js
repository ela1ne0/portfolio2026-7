function nearestHalfHourLine() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const remainder = minutes % 30;
  const roundUp = remainder >= 15; // closer to (or tied with) the next half-hour mark

  let roundedHours = hours;
  let roundedMinutes = minutes - remainder; // the half-hour mark at or before now

  if (roundUp) {
    roundedMinutes += 30;
    if (roundedMinutes >= 60) {
      roundedMinutes = 0;
      roundedHours = (roundedHours + 1) % 24;
    }
  }

  const ampm = roundedHours >= 12 ? 'pm' : 'am';
  const hours12 = roundedHours % 12 || 12;
  const timeStr = `${hours12}:${String(roundedMinutes).padStart(2, '0')}${ampm}`;

  return roundUp
    ? `hope the ${timeStr} isn't early`
    : `the ${timeStr} is always late`;
}

const WAITING_LINES = [
  nearestHalfHourLine,
  'just waiting for my train...',
  "you should try stamping your ticket",
  "you can scroll ahead, I'll catch up",
  'great place to people-watch',
  "I'm waiting...",
  'hope you brought snacks',

  
  
];

const BOARDED_LINES = [
  "that was fast",
  "I guess I'll catch the next one",
  "hope they enjoy the ride",

  "typical, right on time for once",
  "reset the ticket and I'll wait for you instead",
];

let isStamped = false;
document.addEventListener('ticket:stamped', () => { isStamped = true; });
document.addEventListener('ticket:reset',   () => { isStamped = false; });

let waitingIndex = 0;
let boardedIndex = 0;
let hideTimeout = null;

const girlHotspot = document.getElementById('girl-hotspot');

if (girlHotspot) {
  const bubble = document.createElement('div');
  bubble.className = 'girl-speech-bubble';
  bubble.innerHTML = `<div class="girl-bubble-text" id="girl-bubble-text"></div>`;
  document.body.appendChild(bubble);

  const bubbleText = document.getElementById('girl-bubble-text');

  function positionGirlBubble() {
    const rect = girlHotspot.getBoundingClientRect();
    bubble.style.left = (rect.right + 34) + 'px';
    bubble.style.top = (rect.top + rect.height / 2 + 10) + 'px';
  }

  function showGirlBubble() {
    clearTimeout(hideTimeout);
    positionGirlBubble();

    let line;
    if (isStamped) {
      line = BOARDED_LINES[boardedIndex];
      boardedIndex = (boardedIndex + 1) % BOARDED_LINES.length;
    } else {
      line = WAITING_LINES[waitingIndex];
      waitingIndex = (waitingIndex + 1) % WAITING_LINES.length;
    }
    bubbleText.textContent = typeof line === 'function' ? line() : line;
    bubble.classList.add('visible');
  }

  function hideGirlBubble() {
    hideTimeout = setTimeout(() => {
      bubble.classList.remove('visible');
    }, 150);
  }

  girlHotspot.addEventListener('mouseenter', showGirlBubble);
  girlHotspot.addEventListener('mouseleave', hideGirlBubble);

  window.addEventListener('scroll', () => {
    if (bubble.classList.contains('visible')) positionGirlBubble();
  }, { passive: true });
  window.addEventListener('resize', positionGirlBubble);
}
