// Cursor-follow color reveal for the HackDuke work-grid thumbnail.
// Sets --hd-mx / --hd-my on .hackduke-motion so the tint layer's radial
// mask punches a soft hole at the pointer and shows the true-color layer below.

const motion = document.querySelector('.hackduke-motion');

if (motion) {
  const OFF = '-200px';

  function resetMask() {
    motion.style.setProperty('--hd-mx', OFF);
    motion.style.setProperty('--hd-my', OFF);
  }

  motion.addEventListener('mousemove', (e) => {
    const rect = motion.getBoundingClientRect();
    motion.style.setProperty('--hd-mx', `${e.clientX - rect.left}px`);
    motion.style.setProperty('--hd-my', `${e.clientY - rect.top}px`);
  });

  motion.addEventListener('mouseleave', resetMask);

  resetMask();
}
