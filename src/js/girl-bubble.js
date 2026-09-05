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
  "yippee",
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

    // below the mobile layout breakpoint the hotspot spans nearly the full
    // panel width, so "34px to the right" runs the bubble off-screen —
    // center it under the hotspot instead, clamped to stay on-screen
    if (window.matchMedia('(max-width: 900px)').matches) {
      bubble.classList.add('girl-speech-bubble--below');
      const half = Math.min(100, (window.innerWidth - 24) / 2);
      const center = Math.min(
        Math.max(rect.left + rect.width / 2, half + 12),
        window.innerWidth - half - 12
      );
      bubble.style.left = center + 'px';
      bubble.style.top = (rect.bottom + 14) + 'px';
      return;
    }

    bubble.classList.remove('girl-speech-bubble--below');
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

  // touch has no hover — tapping the hotspot reveals the bubble, and each
  // subsequent tap cycles to the next line (showGirlBubble already both
  // shows and advances the index, so re-firing it does exactly that)
  girlHotspot.addEventListener('click', () => {
    clearTimeout(hideTimeout);
    showGirlBubble();
  });

  // tapping anywhere else dismisses it, since touch never fires mouseleave
  document.addEventListener('click', (e) => {
    if (e.target === girlHotspot || bubble.contains(e.target)) return;
    hideGirlBubble();
  });

  window.addEventListener('scroll', () => {
    if (bubble.classList.contains('visible')) positionGirlBubble();
  }, { passive: true });
  window.addEventListener('resize', positionGirlBubble);
}
