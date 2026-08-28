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

// scroll-spy: keep exactly one of home/work marked active based on what's actually in view
const homeSection = document.getElementById('home');
const workSectionEl = document.getElementById('work');
const dotHomeEl = document.getElementById('dot-home');
const dotWorkEl = document.getElementById('dot-work');

function computeStopWidths() {
  const track = document.querySelector('.train-nav__track');
  const stops = document.querySelectorAll('.train-nav__stops > .train-nav__stop');
  if (!track || !stops.length) return ['0%', '33.3333%', '66.6667%', '100%'];
  const trackRect = track.getBoundingClientRect();
  return Array.from(stops).map((stop) => {
    const dot = stop.querySelector('.train-nav__dot');
    if (!dot) return '0%';
    const dotRect = dot.getBoundingClientRect();
    const fraction = ((dotRect.left + dotRect.width / 2) - trackRect.left) / trackRect.width;
    return (fraction * 100) + '%';
  });
}

const STOP_WIDTHS = computeStopWidths();

function setActiveSection(activeDot) {
  [dotHomeEl, dotWorkEl].forEach((dot) => {
    if (!dot) return;
    const isActive = dot === activeDot;
    dot.classList.toggle('is-active', isActive);
    dot.classList.toggle('lit', isActive);
    const link = dot.querySelector('.train-nav__dot');
    if (isActive) link?.setAttribute('aria-current', 'page');
    else link?.removeAttribute('aria-current');
  });

  const stopIndex = activeDot === dotWorkEl ? 1 : 0;
  const fill = document.querySelector('.train-nav__fill');
  if (fill) fill.style.width = STOP_WIDTHS[stopIndex];
  sessionStorage.setItem('navStopIndex', stopIndex);
}

// helper: light up work dot (kept for the ticket-stamp flow, which calls this directly)
function lightWorkDot() {
  setActiveSection(dotWorkEl);
}

// helper: scroll right panel to work section
function scrollToWork() {
  const workSection = document.getElementById('work');
  const rightScroll = document.querySelector('.right-scroll');
  if (workSection && rightScroll) {
    const targetRect = workSection.getBoundingClientRect();
    const scrollRect = rightScroll.getBoundingClientRect();
    const delta = targetRect.top - scrollRect.top;
    rightScroll.scrollTo({
      top: rightScroll.scrollTop + delta,
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

// scroll observer — watches both home and work, activates whichever is in view
window.addEventListener('load', () => {
  const stored = sessionStorage.getItem('navStopIndex');
  const fill = document.querySelector('.train-nav__fill');
  if (fill && stored !== null && STOP_WIDTHS[stored] !== undefined) {
    fill.style.transition = 'none';
    fill.style.width = STOP_WIDTHS[stored];
    void fill.offsetWidth;
    fill.style.transition = '';
  }

  if (homeSection && workSectionEl) {
    const spyObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          console.log('about-train observer fired, isIntersecting:', entry.isIntersecting);
          if (!entry.isIntersecting) return;
          if (entry.target === workSectionEl) setActiveSection(dotWorkEl);
          else if (entry.target === homeSection) setActiveSection(dotHomeEl);
        });
      },
      {
        root: document.querySelector('.right-scroll'),
        threshold: 0.15,
      }
    );
    spyObserver.observe(homeSection);
    spyObserver.observe(workSectionEl);
  }

  const aboutParallax = document.getElementById('about-parallax');
  const aboutTrain = document.getElementById('about-train');
  const rightScrollForTrain = document.querySelector('.right-scroll');
  if (aboutTrain && rightScrollForTrain) {
    let lastScrollTop = rightScrollForTrain.scrollTop;
    let trainOffset = 0;
    const TRAIN_MIN = -140;
    const TRAIN_MAX = 140;
    const SCROLL_FACTOR = 0.3;

    const updateTrainPosition = () => {
      const currentScrollTop = rightScrollForTrain.scrollTop;
      const delta = currentScrollTop - lastScrollTop;
      trainOffset = Math.max(TRAIN_MIN, Math.min(TRAIN_MAX, trainOffset + delta * SCROLL_FACTOR));
      aboutTrain.style.transform = `translateX(${trainOffset}px)`;
      lastScrollTop = currentScrollTop;
    };

    rightScrollForTrain.addEventListener('scroll', updateTrainPosition, { passive: true });
  }

  const footerCat = document.getElementById('footer-cat');
  const rightScrollEl = document.querySelector('.right-scroll');
  if (footerCat && rightScrollEl) {
    const checkFooterCatReveal = () => {
      const distanceFromBottom =
        rightScrollEl.scrollHeight - rightScrollEl.scrollTop - rightScrollEl.clientHeight;
      footerCat.classList.toggle('revealed', distanceFromBottom <= 4);
    };
    rightScrollEl.addEventListener('scroll', checkFooterCatReveal, { passive: true });
    checkFooterCatReveal();
  }
});

window.addEventListener('beforeunload', () => {
  const currentActive = document.querySelector('.train-nav__stop.is-active');
  const stopIndex = currentActive === dotWorkEl ? 1 : 0;
  sessionStorage.setItem('navStopIndex', stopIndex);
});

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
  rightScroll?.scrollTo({ top: 0, behavior: 'smooth' });
  recruiterPanel?.classList.add('visible');
  if (panels) panels.style.display = 'none';
  recruiterToggle?.classList.add('active');
  if (recruiterToggle) recruiterToggle.textContent = 'exit';
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