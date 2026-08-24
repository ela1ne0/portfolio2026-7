// Cursor-follow color reveal for the HackDuke work-grid thumbnail.
// The card is rendered twice — a true-color layer underneath, and a grayscale
// + blue-tinted duplicate on top (see .hd-tint-layer in layout.css). The top
// layer is masked with a radial-gradient hole; moving the mouse updates the
// hole's position via CSS custom properties, "erasing" the tint locally and
// revealing the true color underneath.

const cards = document.querySelectorAll('.hackduke-motion');

cards.forEach((card) => {
  const setPosition = (event) => {
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    card.style.setProperty('--hd-mx', `${x}px`);
    card.style.setProperty('--hd-my', `${y}px`);
  };

  const reset = () => {
    card.style.removeProperty('--hd-mx');
    card.style.removeProperty('--hd-my');
  };

  card.addEventListener('mousemove', setPosition);
  card.addEventListener('mouseleave', reset);
});
