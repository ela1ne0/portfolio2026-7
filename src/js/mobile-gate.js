// Shows a "best viewed on desktop" overlay below the site's mobile
// breakpoint, since the layout leans on hover states, a custom cursor,
// and side-by-side scroll columns that don't hold up on small/touch
// screens. Dismissing it is remembered for the browser session (via
// sessionStorage) so it doesn't reappear on every internal page nav,
// but it's back for a fresh visit.

const BREAKPOINT = 1100;
const DISMISS_KEY = 'desktop-gate-dismissed';

function wasDismissed() {
  try {
    return sessionStorage.getItem(DISMISS_KEY) === '1';
  } catch (e) {
    return false;
  }
}

function markDismissed() {
  try {
    sessionStorage.setItem(DISMISS_KEY, '1');
  } catch (e) {
    // ignore — worst case the gate reappears on next nav
  }
}

function buildGate() {
  const gate = document.createElement('div');
  gate.className = 'desktop-gate';
  gate.innerHTML = `
    <div class="desktop-gate__label">heads up</div>
    <h1 class="desktop-gate__title">this site's built for a bigger screen</h1>
    <p class="desktop-gate__body">some of the details here — hover states, a custom cursor, side-scrolling panels — need a mouse and a bit more room to breathe.</p>
    <button class="desktop-gate__continue" type="button">continue anyway →</button>
  `;
  document.body.appendChild(gate);
  gate.querySelector('.desktop-gate__continue').addEventListener('click', () => {
    markDismissed();
    gate.remove();
  });
  return gate;
}

function checkGate() {
  const isSmall = window.innerWidth < BREAKPOINT;
  const dismissed = wasDismissed();
  const existing = document.querySelector('.desktop-gate');

  if (isSmall && !dismissed && !existing) {
    buildGate();
  } else if ((!isSmall || dismissed) && existing) {
    existing.remove();
  }
}

checkGate();
window.addEventListener('resize', checkGate);