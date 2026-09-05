// Off-canvas sidebar drawer — mobile only.
//
// This is a layout concern, not an interaction-capability one (see the
// hover/pointer split in mobile-version-plan), so unlike cursor.js it isn't
// gated behind matchMedia: it just always mounts. Below the 900px layout
// breakpoint, CSS turns .left-col into a fixed off-canvas panel and reveals
// this button; above it, the button stays display:none and the scrim stays
// fully transparent + click-through, so this module has nothing to do.

const toggle = document.getElementById('sidebar-toggle');
const sidebar = document.getElementById('left-col');
const scrim = document.getElementById('sidebar-scrim');

if (toggle && sidebar && scrim) {
  function openSidebar() {
    sidebar.classList.add('is-open');
    scrim.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
  }

  function closeSidebar() {
    sidebar.classList.remove('is-open');
    scrim.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  }

  toggle.addEventListener('click', () => {
    if (sidebar.classList.contains('is-open')) {
      closeSidebar();
    } else {
      openSidebar();
    }
  });

  scrim.addEventListener('click', closeSidebar);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeSidebar();
  });

  // switching back to a desktop-sized viewport (e.g. rotating a tablet, or
  // a resize during testing) shouldn't leave the drawer "stuck" open under
  // layout rules that no longer apply to it
  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) closeSidebar();
  });
}
