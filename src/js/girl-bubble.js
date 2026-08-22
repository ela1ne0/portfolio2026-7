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

const GIRL_LINES = [
  nearestHalfHourLine,
  'just waiting for my train...',
  "you can scroll ahead, I'll catch up",
  'great place to people-watch',
  'almost missed this one',
  'hope you brought snacks',
  'this is the calm before the scroll',
  'yes, I designed this outfit too',
  'next stop: the good stuff',
  "don't mind me, just vibing",
];

let girlLineIndex = 0;
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
    bubble.style.left = (rect.left + rect.width / 2) + 'px';
    bubble.style.top = rect.top + 'px';
  }

  function showGirlBubble() {
    clearTimeout(hideTimeout);
    positionGirlBubble();
    const line = GIRL_LINES[girlLineIndex];
    bubbleText.textContent = typeof line === 'function' ? line() : line;
    girlLineIndex = (girlLineIndex + 1) % GIRL_LINES.length;
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
