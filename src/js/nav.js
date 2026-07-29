// footer year
const yr = document.getElementById('footer-year');
if (yr) yr.textContent = new Date().getFullYear();

// back to top
const scrollUpBtn = document.getElementById('scroll-up');
if (scrollUpBtn) {
  scrollUpBtn.addEventListener('click', () => {
    const rightScroll = document.querySelector('.right-scroll');
    if (rightScroll) {
      rightScroll.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
}

// scroll caption hide on scroll
window.addEventListener('scroll', () => {
  const caption = document.getElementById('scroll-caption');
  if (!caption) return;
  if (window.scrollY > window.innerHeight * 0.2) {
    caption.classList.add('hidden');
  } else {
    caption.classList.remove('hidden');
  }
}, { passive: true });

// helper: light up work dot
function lightWorkDot() {
  const dotWork = document.getElementById('dot-work');
  const lblWork = document.getElementById('lbl-work');
  if (dotWork) dotWork.classList.add('lit');
  if (lblWork) lblWork.classList.add('lit');
}

// helper: scroll right panel to work section
function scrollToWork() {
  const workSection = document.getElementById('work');
  const rightScroll = document.querySelector('.right-scroll');
  if (workSection && rightScroll) {
    rightScroll.scrollTo({
      top: workSection.offsetTop,
      behavior: 'smooth'
    });
  }
}

// work nav link click — scroll + light dot
const workLink = document.getElementById('nav-work-link');
if (workLink) {
  workLink.addEventListener('click', (e) => {
    e.preventDefault();
    scrollToWork();
    lightWorkDot();
  });
}

// Add this to nav.js — scroll observer for work section
const workSection = document.getElementById('work');

if (workSection) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          lightWorkDot();
        }
      });
    },
    {
      // trigger when 10% of work section is visible
      root: document.querySelector('.right-scroll'),
      threshold: 0.1,
    }
  );
  observer.observe(workSection);
}

export function initNav() {
  const nav = document.getElementById('main-nav');
  if (!nav) return;

  const stops = nav.querySelectorAll('.train-nav__stop');

  nav.querySelectorAll('.train-nav__dot').forEach((link) => {
    link.addEventListener('click', (event) => {
      const href = link.getAttribute('href');
      if (!href || !href.startsWith('#')) return;
      const target = document.getElementById(href.slice(1));
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  stops.forEach((stop) => {
    const link = stop.querySelector('.train-nav__dot');
    if (!link) return;
    link.addEventListener('click', () => {
      stops.forEach((s) => {
        s.classList.remove('is-active');
        s.querySelector('.train-nav__dot')?.removeAttribute('aria-current');
      });
      stop.classList.add('is-active');
      link.setAttribute('aria-current', 'page');
    });
  });
}

// recruiter mode
const recruiterPanel  = document.getElementById('recruiter-panel');
const rightScroll     = document.querySelector('.right-scroll');
const panels          = document.querySelector('.panels');
const recruiterToggle = document.getElementById('recruiter-toggle');

function enableRecruiterMode() {
  recruiterPanel?.classList.add('visible');
  if (panels) panels.style.display = 'none';
  recruiterToggle?.classList.add('active');
  if (recruiterToggle) recruiterToggle.textContent = 'exit recruiter mode';
  const url = new URL(window.location);
  url.searchParams.set('recruiter', 'true');
  window.history.replaceState({}, '', url);
}

function disableRecruiterMode() {
  recruiterPanel?.classList.remove('visible');
  if (panels) panels.style.display = '';
  recruiterToggle?.classList.remove('active');
  if (recruiterToggle) recruiterToggle.textContent = 'recruiter mode';
  const url = new URL(window.location);
  url.searchParams.delete('recruiter');
  window.history.replaceState({}, '', url);
}

if (new URLSearchParams(window.location.search)
  .get('recruiter') === 'true') {
  enableRecruiterMode();
}

recruiterToggle?.addEventListener('click', () => {
  if (recruiterPanel?.classList.contains('visible')) {
    disableRecruiterMode();
  } else {
    enableRecruiterMode();
  }
});

// recruiter clock
function updateRecClock() {
  const el = document.getElementById('rec-clock');
  if (!el) return;
  const now = new Date();
  const h   = now.getHours() % 12 || 12;
  const m   = String(now.getMinutes()).padStart(2,'0');
  const s   = String(now.getSeconds()).padStart(2,'0');
  const ap  = now.getHours() >= 12 ? 'PM' : 'AM';
  const tz  = now.toLocaleTimeString('en-US',
    { timeZoneName: 'short' }).split(' ')[2];
  const mo  = now.toLocaleString('en-US',
    { month: 'short' }).toUpperCase();
  const d   = String(now.getDate()).padStart(2,'0');
  el.textContent =
    `${String(h).padStart(2,'0')}:${m}:${s} ${ap} ${tz} · ${d} ${mo} ${now.getFullYear()}`;
}

updateRecClock();
setInterval(updateRecClock, 1000);