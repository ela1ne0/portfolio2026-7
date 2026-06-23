/**
 * cursor.js
 * Custom train-marker cursor for Elaine Yu portfolio
 *
 * Behavior:
 * - Default: small filled circle (like a nav stop dot)
 * - Hover links/panels: expands to outlined circle (like an active station)
 * - Hover ticket panel: swaps to stamp head cursor (already in ticket.js)
 * - Click: brief pulse/ripple (like a station being passed through)
 * - Trails slightly behind mouse for an organic, hand-drawn feel
 */

// ── Create cursor elements ──────────────────────────────────────────────────

const cursorDot  = document.createElement('div');
const cursorRing = document.createElement('div');

cursorDot.className  = 'cur-dot';
cursorRing.className = 'cur-ring';

document.body.appendChild(cursorDot);
document.body.appendChild(cursorRing);

// ── State ───────────────────────────────────────────────────────────────────

let mouseX = -100, mouseY = -100;  // start off screen
let ringX  = -100, ringY  = -100;  // ring lags behind
let isHovering  = false;
let isOnTicket  = false;
let rafId       = null;

// ── Mouse tracking ──────────────────────────────────────────────────────────

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

// ── Hover states ────────────────────────────────────────────────────────────

// elements that trigger the "active station" ring expansion
const hoverSelectors = [
  'a',
  'button',
  '.stop',           // nav dots
  '.project-card',
  '.panel-platform',
  '.panel-bottom',
  '[data-hover]',
].join(', ');

function bindHoverElements() {
  document.querySelectorAll(hoverSelectors).forEach(el => {
    el.addEventListener('mouseenter', () => {
      if (isOnTicket) return;
      isHovering = true;
      cursorDot.classList.add('hovering');
      cursorRing.classList.add('hovering');
    });
    el.addEventListener('mouseleave', () => {
      isHovering = false;
      cursorDot.classList.remove('hovering');
      cursorRing.classList.remove('hovering');
    });
  });
}

// ticket panel: hide our cursor, let ticket.js handle its stamp cursor
const ticketPanel = document.getElementById('panel-ticket');
if (ticketPanel) {
  ticketPanel.addEventListener('mouseenter', () => {
    isOnTicket = true;
    cursorDot.classList.add('hidden');
    cursorRing.classList.add('hidden');
  });
  ticketPanel.addEventListener('mouseleave', () => {
    isOnTicket = false;
    cursorDot.classList.remove('hidden');
    cursorRing.classList.remove('hidden');
  });
}

// nav dots: extra pulse on hover (station-passing feel)
document.querySelectorAll('.dot, .stop').forEach(dot => {
  dot.addEventListener('mouseenter', () => {
    cursorRing.classList.add('on-station');
  });
  dot.addEventListener('mouseleave', () => {
    cursorRing.classList.remove('on-station');
  });
});

// ── Click ripple ────────────────────────────────────────────────────────────

document.addEventListener('click', e => {
  if (isOnTicket) return;

  // spawn a ripple at click position
  const ripple = document.createElement('div');
  ripple.className = 'cur-ripple';
  ripple.style.left = e.clientX + 'px';
  ripple.style.top  = e.clientY + 'px';
  document.body.appendChild(ripple);

  // brief dot slam
  cursorDot.classList.add('clicking');
  setTimeout(() => {
    cursorDot.classList.remove('clicking');
    ripple.remove();
  }, 500);
});

// ── Animation loop — ring trails the dot ────────────────────────────────────

const LERP = 0.12; // lower = more lag, higher = tighter follow

function lerp(a, b, t) { return a + (b - a) * t; }

function animate() {
  // dot snaps directly to mouse
  cursorDot.style.left = mouseX + 'px';
  cursorDot.style.top  = mouseY + 'px';

  // ring lerps toward mouse with slight lag
  ringX = lerp(ringX, mouseX, LERP);
  ringY = lerp(ringY, mouseY, LERP);
  cursorRing.style.left = ringX + 'px';
  cursorRing.style.top  = ringY + 'px';

  rafId = requestAnimationFrame(animate);
}

animate();

// ── Hide native cursor everywhere ───────────────────────────────────────────
// (ticket panel keeps cursor:none from its own CSS;
//  stamp cursor is position:fixed from ticket.js)
document.body.style.cursor = 'none';

// also hide on all interactive elements in case CSS specificity overrides
document.querySelectorAll('a, button, input, [role="button"]')
  .forEach(el => el.style.cursor = 'none');

// ── Re-bind on DOM changes (for dynamically added elements) ─────────────────
// e.g. the reset button that appears after stamping
const observer = new MutationObserver(() => bindHoverElements());
observer.observe(document.body, { childList: true, subtree: true });

bindHoverElements();

// ── Restore native cursor if user tabs away ──────────────────────────────────
document.addEventListener('mouseleave', () => {
  cursorDot.classList.add('hidden');
  cursorRing.classList.add('hidden');
});
document.addEventListener('mouseenter', () => {
  cursorDot.classList.remove('hidden');
  cursorRing.classList.remove('hidden');
});
