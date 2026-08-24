// Positions the HackDuke case-study hover popout as a viewport-fixed
// element. It has to be fixed rather than positioned relative to the card,
// because .right-scroll (the page's internally-scrolling container) has
// overflow-x:hidden and would clip anything that tried to extend past the
// card's own box via absolute positioning. This keeps it glued to the
// card's live on-screen position instead, and flips it to the card's left
// side when there isn't enough room on the right (e.g. a narrower window).

const wrap = document.querySelector('.work-panel-wrap');
const popout = wrap?.querySelector('.work-panel__popout');
const card = wrap?.querySelector('.work-panel');
const rightScroll = document.querySelector('.right-scroll');

if (wrap && popout && card) {
  const GAP = 16;
  const EDGE_MARGIN = 8;
  let isOver = false;

  const place = () => {
    const cardRect = card.getBoundingClientRect();
    const popoutWidth = popout.offsetWidth;
    const popoutHeight = popout.offsetHeight;

    const fitsRight = cardRect.right + GAP + popoutWidth <= window.innerWidth - EDGE_MARGIN;
    const left = fitsRight
      ? cardRect.right + GAP
      : Math.max(EDGE_MARGIN, cardRect.left - GAP - popoutWidth);

    const maxTop = Math.max(window.innerHeight - popoutHeight - EDGE_MARGIN, EDGE_MARGIN);
    const top = Math.min(Math.max(cardRect.top, EDGE_MARGIN), maxTop);

    popout.style.left = `${left}px`;
    popout.style.top = `${top}px`;
    popout.classList.toggle('work-panel__popout--flipped', !fitsRight);
  };

  wrap.addEventListener('mouseenter', () => {
    isOver = true;
    place();
  });
  wrap.addEventListener('mouseleave', () => {
    isOver = false;
  });
  rightScroll?.addEventListener('scroll', () => { if (isOver) place(); }, { passive: true });
  window.addEventListener('resize', () => { if (isOver) place(); });
}
