const yr = document.getElementById('footer-year');
if (yr) yr.textContent = new Date().getFullYear();

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

window.addEventListener('scroll', () => {
  const caption = document.getElementById('scroll-caption');
  if (!caption) return;
  if (window.scrollY > window.innerHeight * 0.2) {
    caption.classList.add('hidden');
  } else {
    caption.classList.remove('hidden');
  }
}, { passive: true });

const workLink = document.getElementById('nav-work-link');
if (workLink) {
  workLink.addEventListener('click', (e) => {
    e.preventDefault();
    const workSection = document.getElementById('work');
    const rightScroll = document.querySelector('.right-scroll');

    if (workSection && rightScroll) {
      // scroll the right panel, not window
      // since only .right-scroll scrolls
      const offset = workSection.offsetTop;
      rightScroll.scrollTo({
        top: offset,
        behavior: 'smooth'
      });
    }
  });
}

export function initNav() {
  const nav = document.getElementById('main-nav')
  if (!nav) return

  const stops = nav.querySelectorAll('.train-nav__stop')

  nav.querySelectorAll('.train-nav__dot').forEach((link) => {
    link.addEventListener('click', (event) => {
      const href = link.getAttribute('href')
      if (!href || !href.startsWith('#')) return

      const target = document.getElementById(href.slice(1))
      if (!target) return

      event.preventDefault()
      target.scrollIntoView({ behavior: 'smooth' })
    })
  })

  stops.forEach((stop) => {
    const link = stop.querySelector('.train-nav__dot')
    if (!link) return

    link.addEventListener('click', () => {
      stops.forEach((s) => {
        s.classList.remove('is-active')
        s.querySelector('.train-nav__dot')?.removeAttribute('aria-current')
      })
      stop.classList.add('is-active')
      link.setAttribute('aria-current', 'page')
    })
  })
}
