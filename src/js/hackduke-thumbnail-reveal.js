// Cursor-follow color reveal — with a soft trailing tail — for the HackDuke
// work-grid thumbnail. The card is rendered twice — a true-color layer
// underneath, and a grayscale + blue-tinted duplicate on top (see
// .hd-tint-layer in layout.css). Instead of one hard hole that snaps to the
// mouse, the top layer is masked by a small SVG <mask>: a handful of blurred
// black circles sampled from a *lerped* (slightly lagging) cursor position
// over the last ~240ms, painted over a solid white base. Black = hidden
// (reveals true color), white = visible (grayscale/tint shows) — so moving
// the mouse leaves a soft comet-like trail of revealed color behind it, and
// holding still (or leaving the card) lets the trail catch up and fade away
// on its own as old samples age out.
//
// Falls back gracefully with no JS: layout.css still sets a static
// radial-gradient mask-image on .hd-tint-layer, which this script overrides
// via inline style once it runs.

const LERP = 0.22;           // 0–1: how quickly the reveal "catches up" to the real cursor
const TRAIL_LIFETIME = 240;  // ms a sampled point stays part of the trail
const POOL_SIZE = 10;        // pre-created circles per card; unused ones sit at r:0
const BASE_RADIUS = 58;      // px, radius of the newest/freshest trail circle
const MIN_RADIUS = 17;       // px, radius trail circles shrink to as they age out
const BLUR_STD_DEV = 12;     // px, softens circle edges and blends overlapping points

const cards = document.querySelectorAll('.hackduke-motion');

if (cards.length) {
  const svgNS = 'http://www.w3.org/2000/svg';

  // one shared hidden SVG holds every card's <mask>, same pattern as the
  // #roughen stamp filter already defined in index.html
  const maskSvg = document.createElementNS(svgNS, 'svg');
  maskSvg.setAttribute('style', 'position:absolute;width:0;height:0');
  maskSvg.setAttribute('aria-hidden', 'true');
  const defs = document.createElementNS(svgNS, 'defs');
  maskSvg.appendChild(defs);
  document.body.appendChild(maskSvg);

  cards.forEach((card, i) => {
    const tintLayer = card.querySelector('.hd-tint-layer');
    if (!tintLayer) return;

    // both the <filter> and <mask> elements default to a percentage-based
    // region sized off their content's bounding box (roughly -10%/120%) —
    // fine for objectBoundingBox, but with userSpaceOnUse units and a
    // deliberately oversized coverage rect (below) that default collapses
    // to a sliver, which clips the mask's content away almost entirely and
    // makes the "hidden by default" white base disappear. Setting explicit,
    // generous userSpaceOnUse regions on both avoids that.
    const blurId = `hd-reveal-blur-${i}`;
    const filter = document.createElementNS(svgNS, 'filter');
    filter.setAttribute('id', blurId);
    filter.setAttribute('filterUnits', 'userSpaceOnUse');
    filter.setAttribute('x', '-2000');
    filter.setAttribute('y', '-2000');
    filter.setAttribute('width', '5000');
    filter.setAttribute('height', '5000');
    const blur = document.createElementNS(svgNS, 'feGaussianBlur');
    blur.setAttribute('stdDeviation', String(BLUR_STD_DEV));
    filter.appendChild(blur);
    defs.appendChild(filter);

    const maskId = `hd-reveal-mask-${i}`;
    const mask = document.createElementNS(svgNS, 'mask');
    mask.setAttribute('id', maskId);
    mask.setAttribute('mask-type', 'luminance');
    mask.setAttribute('maskUnits', 'userSpaceOnUse');
    mask.setAttribute('maskContentUnits', 'userSpaceOnUse');
    mask.setAttribute('x', '-9999');
    mask.setAttribute('y', '-9999');
    mask.setAttribute('width', '20000');
    mask.setAttribute('height', '20000');

    const group = document.createElementNS(svgNS, 'g');
    group.setAttribute('filter', `url(#${blurId})`);
    mask.appendChild(group);

    // white base = tint fully visible everywhere by default; oversized so it
    // covers the card regardless of its actual rendered size
    const base = document.createElementNS(svgNS, 'rect');
    base.setAttribute('x', '-9999');
    base.setAttribute('y', '-9999');
    base.setAttribute('width', '20000');
    base.setAttribute('height', '20000');
    base.setAttribute('fill', '#fff');
    group.appendChild(base);

    // black circles = holes that reveal true color; pooled and repositioned
    // every frame instead of created/destroyed to keep this cheap
    const circles = [];
    for (let c = 0; c < POOL_SIZE; c++) {
      const circle = document.createElementNS(svgNS, 'circle');
      circle.setAttribute('cx', '-9999');
      circle.setAttribute('cy', '-9999');
      circle.setAttribute('r', '0');
      circle.setAttribute('fill', '#000');
      group.appendChild(circle);
      circles.push(circle);
    }

    defs.appendChild(mask);

    tintLayer.style.maskImage = `url(#${maskId})`;
    tintLayer.style.webkitMaskImage = `url(#${maskId})`;

    let targetX = null;
    let targetY = null;
    let smoothX = 0;
    let smoothY = 0;
    let smoothed = false; // true once smoothX/Y has a real starting point
    let active = false;
    let trail = [];

    const setTarget = (event) => {
      const rect = card.getBoundingClientRect();
      targetX = event.clientX - rect.left;
      targetY = event.clientY - rect.top;
      if (!smoothed) {
        smoothX = targetX;
        smoothY = targetY;
        smoothed = true;
      }
      active = true;
    };

    const clearTarget = () => {
      active = false;
      targetX = null;
      targetY = null;
    };

    card.addEventListener('mouseenter', setTarget);
    card.addEventListener('mousemove', setTarget);
    card.addEventListener('mouseleave', clearTarget);

    function tick(now) {
      if (active && targetX !== null) {
        smoothX += (targetX - smoothX) * LERP;
        smoothY += (targetY - smoothY) * LERP;
        trail.push({ x: smoothX, y: smoothY, t: now });
      }

      if (trail.length) {
        trail = trail.filter((p) => now - p.t < TRAIL_LIFETIME);
      }

      const count = Math.min(trail.length, POOL_SIZE);
      const startIndex = trail.length - count;
      for (let idx = 0; idx < POOL_SIZE; idx++) {
        const circle = circles[idx];
        if (idx < count) {
          const point = trail[startIndex + idx];
          const age = Math.min((now - point.t) / TRAIL_LIFETIME, 1); // 0 fresh → 1 expiring
          const radius = BASE_RADIUS - age * (BASE_RADIUS - MIN_RADIUS);
          circle.setAttribute('cx', point.x);
          circle.setAttribute('cy', point.y);
          circle.setAttribute('r', radius);
          circle.setAttribute('opacity', String(Math.max(1 - age, 0)));
        } else {
          circle.setAttribute('r', '0');
        }
      }

      requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  });
}
