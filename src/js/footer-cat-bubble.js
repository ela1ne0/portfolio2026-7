const CAT_LINES = [
  'meow',
  "you've reached the end",
  '...of the line, technically',
  'no more stops after this',
  'maybe you should get a bus',
  "come back soon!",
  "glad we could cross paths!",
  "til next time!",
  "meow meow meow",
  "miao miao miao",
  "喵喵喵",

];

let catLineIndex = 0;
let hideTimeout = null;

const footerCat = document.getElementById('footer-cat');

if (footerCat) {
  const bubble = document.createElement('div');
  bubble.className = 'cat-speech-bubble';
  bubble.innerHTML = `<div class="cat-bubble-text" id="cat-bubble-text"></div>`;
  document.body.appendChild(bubble);

  const bubbleText = document.getElementById('cat-bubble-text');

  function positionCatBubble() {
    const rect = footerCat.getBoundingClientRect();
    bubble.style.left = (rect.left + rect.width / 2) + 'px';
    bubble.style.top = rect.top + 'px';
  }

  function showCatBubble() {
    clearTimeout(hideTimeout);
    positionCatBubble();
    bubbleText.textContent = CAT_LINES[catLineIndex];
    catLineIndex = (catLineIndex + 1) % CAT_LINES.length;
    bubble.classList.add('visible');
  }

  function hideCatBubble() {
    hideTimeout = setTimeout(() => {
      bubble.classList.remove('visible');
    }, 150);
  }

  footerCat.addEventListener('mouseenter', showCatBubble);
  footerCat.addEventListener('mouseleave', hideCatBubble);

  window.addEventListener('scroll', () => {
    if (bubble.classList.contains('visible')) positionCatBubble();
  }, { passive: true });
  window.addEventListener('resize', positionCatBubble);
}
