// ACTS MISSION ALLIANCE v5.1.3 — STICKY DESKTOP MEGA MENU
// Desktop: hover/click opens a menu and it stays open until another menu,
// an outside click, Escape, or a submenu link is selected.
(() => {
  const header = document.querySelector('.mega-header');
  if (!header) return;

  const desktopMQ = window.matchMedia('(min-width: 981px)');
  const mobileBtn = header.querySelector('.mega-mobile-btn');
  const items = [...header.querySelectorAll('.mega-item')];

  const setOpen = (item, open) => {
    item.classList.toggle('is-open', open);
    const trigger = item.querySelector('.mega-trigger');
    if (trigger) trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
  };

  const closeAll = (except = null) => {
    items.forEach(item => {
      if (item !== except) setOpen(item, false);
    });
  };

  items.forEach(item => {
    const trigger = item.querySelector('.mega-trigger');
    if (!trigger) return;
    trigger.setAttribute('aria-expanded', 'false');

    // Desktop: hovering a top-level trigger opens it and DOES NOT auto-close.
    trigger.addEventListener('mouseenter', () => {
      if (!desktopMQ.matches) return;
      closeAll(item);
      setOpen(item, true);
    });

    // Click works on both desktop and mobile.
    trigger.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      const opening = !item.classList.contains('is-open');
      closeAll(item);
      setOpen(item, opening);
    });
  });

  if (mobileBtn) {
    mobileBtn.addEventListener('click', e => {
      e.stopPropagation();
      const open = header.classList.toggle('menu-open');
      mobileBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (!open) closeAll();
    });
  }

  // Only an outside click closes the desktop menu.
  document.addEventListener('click', e => {
    if (!header.contains(e.target)) {
      closeAll();
      header.classList.remove('menu-open');
      if (mobileBtn) mobileBtn.setAttribute('aria-expanded', 'false');
    }
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeAll();
      header.classList.remove('menu-open');
      if (mobileBtn) mobileBtn.setAttribute('aria-expanded', 'false');
    }
  });

  header.querySelectorAll('.mega-panel a').forEach(a => {
    a.addEventListener('click', () => {
      closeAll();
      header.classList.remove('menu-open');
      if (mobileBtn) mobileBtn.setAttribute('aria-expanded', 'false');
    });
  });

  desktopMQ.addEventListener?.('change', () => {
    closeAll();
    header.classList.remove('menu-open');
    if (mobileBtn) mobileBtn.setAttribute('aria-expanded', 'false');
  });
})();
