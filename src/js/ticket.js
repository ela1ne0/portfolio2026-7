const panelTicket  = document.getElementById('panel-ticket');
const ticketCard   = document.getElementById('ticket-card');
const scanLine     = document.getElementById('scan-line');
const scanGlow     = document.getElementById('scan-glow');
const stampMark    = document.getElementById('stamp-mark');
const splatter     = document.getElementById('splatter');
const cursorEl     = document.getElementById('cursor');
const instruction  = document.getElementById('ticket-instruction');
const capPlatform  = document.getElementById('cap-platform');
const capTrain     = document.getElementById('cap-train');
const dotHome      = document.getElementById('dot-home');

let scanned  = false;
let stamped  = false;
let scanning = false;

// live time
function updateTime() {
  const now = new Date();
  const months = ['JAN','FEB','MAR','APR','MAY','JUN',
                  'JUL','AUG','SEP','OCT','NOV','DEC'];
  const dateEl = document.getElementById('ticket-date');
  const timeEl = document.getElementById('ticket-departs');
  if (dateEl) dateEl.textContent =
    String(now.getDate()).padStart(2,'0') + months[now.getMonth()];
  if (timeEl) timeEl.textContent =
    String(now.getHours()).padStart(2,'0') + ':' +
    String(now.getMinutes()).padStart(2,'0');
}
updateTime();
setInterval(updateTime, 60000);

// cursor tracking
document.addEventListener('mousemove', e => {
  cursorEl.style.left = e.clientX + 'px';
  cursorEl.style.top  = e.clientY + 'px';
});

// hover → scan
panelTicket.addEventListener('mouseenter', () => {
  if (stamped) return;
  cursorEl.classList.add('show');
  if (!scanned && !scanning) startScan();
});

panelTicket.addEventListener('mouseleave', () => {
  cursorEl.classList.remove('show');
});

// click → stamp
panelTicket.addEventListener('click', () => {
  if (stamped) return;
  doStamp();
});

function startScan() {
  if (scanning || scanned) return;
  scanning = true;
  const h = ticketCard.offsetHeight;
  scanLine.style.setProperty('--scan-h', h + 'px');
  scanGlow.style.setProperty('--scan-h', h + 'px');
  scanLine.classList.add('scanning');
  scanGlow.classList.add('scanning');
  playBeep(880, 0.05, 0.1);
  setTimeout(() => {
    scanLine.classList.remove('scanning');
    scanGlow.classList.remove('scanning');
    scanning = false;
    scanned  = true;
  }, 880);
}

function doStamp() {
  if (stamped) return;
  stamped = true;

  stampMark.classList.add('stamped');
  for (let i = 0; i < 10; i++) setTimeout(spawnSplat, i * 14);
  playThud();

  setTimeout(() => {
    instruction.classList.add('hide');
    cursorEl.classList.remove('show');
  }, 100);

  //dialogue 1
  setTimeout(() => {
    dotHome.classList.add('is-active');
    dotHome.querySelector('.train-nav__dot')?.setAttribute('aria-current', 'page');
    capPlatform.classList.add('visible');
    typeText(capPlatform,
      'platform 01... this is it', 42);
  }, 350);

  //dialogue 2
  setTimeout(() => {
    capTrain.classList.add('visible');
    typeText(capTrain,
      "okay, let's go on this journey together", 48);
  }, 2400);

  setTimeout(() => {
    const resetEl = document.createElement('div');
    resetEl.id = 'ticket-reset';
    resetEl.textContent = '↺ reset';
    resetEl.style.cssText = `
      position: absolute;
      bottom: 14px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 15px;
      letter-spacing: 0.12em;
      color: rgba(26,82,212,0.35);
      font-family: var(--font-mono);
      cursor: pointer;
      opacity: 0;
      transition: opacity 0.4s, color 0.2s;
      z-index: 10;
      white-space: nowrap;
    `;
    panelTicket.appendChild(resetEl);
    requestAnimationFrame(() => resetEl.style.opacity = '1');

    resetEl.addEventListener('mouseenter', () => {
      resetEl.style.color = 'rgba(26,82,212,0.8)';
      panelTicket.style.cursor = 'pointer';
    });
    resetEl.addEventListener('mouseleave', () => {
      resetEl.style.color = 'rgba(26,82,212,0.35)';
    });
    resetEl.addEventListener('click', (e) => {
      e.stopPropagation();
      resetTicket();
    });
  }, 4500);
}

function resetTicket() {
  stamped  = false;
  scanned  = false;
  scanning = false;

  stampMark.classList.remove('stamped');
  stampMark.style.opacity = '';
  stampMark.style.transform = '';
  void stampMark.offsetWidth;

  capPlatform.textContent = '';
  capPlatform.classList.remove('visible');
  capTrain.textContent = '';
  capTrain.classList.remove('visible');

  dotHome.classList.remove('is-active');
  dotHome.querySelector('.train-nav__dot')?.removeAttribute('aria-current');

  instruction.classList.remove('hide');

  const resetEl = document.getElementById('ticket-reset');
  if (resetEl) resetEl.remove();

  panelTicket.style.cursor = 'none';
}

function typeText(el, text, delay) {
  el.textContent = '';
  let i = 0;
  const iv = setInterval(() => {
    el.textContent += text[i++];
    if (i >= text.length) clearInterval(iv);
  }, delay);
}

function spawnSplat() {
  const s = document.createElement('div');
  s.className = 'splat';
  const size  = 2 + Math.random() * 5;
  const angle = Math.random() * Math.PI * 2;
  const dist  = 25 + Math.random() * 55;
  s.style.cssText = `
    width:${size}px; height:${size}px;
    left:${20+Math.random()*60}%;
    top:${20+Math.random()*60}%;
    --tx:${Math.cos(angle)*dist}px;
    --ty:${Math.sin(angle)*dist}px;
  `;
  splatter.appendChild(s);
  requestAnimationFrame(() => s.classList.add('burst'));
  setTimeout(() => s.remove(), 550);
}

let audioCtx;
function getCtx() {
  if (!audioCtx)
    audioCtx = new (window.AudioContext||window.webkitAudioContext)();
  return audioCtx;
}
function playBeep(freq, gain, dur) {
  try {
    const ctx = getCtx();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.connect(g); g.connect(ctx.destination);
    o.frequency.value = freq;
    g.gain.setValueAtTime(0, ctx.currentTime);
    g.gain.linearRampToValueAtTime(gain, ctx.currentTime + 0.01);
    g.gain.linearRampToValueAtTime(0, ctx.currentTime + dur);
    o.start(); o.stop(ctx.currentTime + dur + 0.05);
  } catch(e) {}
}
function playThud() {
  try {
    const ctx = getCtx();
    const buf  = ctx.createBuffer(1, ctx.sampleRate*0.12, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++)
      data[i] = (Math.random()*2-1) * Math.pow(1-i/data.length, 3);
    const src = ctx.createBufferSource();
    const flt = ctx.createBiquadFilter();
    const g   = ctx.createGain();
    src.buffer = buf;
    flt.type = 'lowpass'; flt.frequency.value = 160;
    g.gain.value = 0.55;
    src.connect(flt); flt.connect(g); g.connect(ctx.destination);
    src.start();
    playBeep(2400, 0.03, 0.025);
  } catch(e) {}
}
