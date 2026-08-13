// ACTS MISSION ALLIANCE v5.1 — common mega menu
(() => {
  const header = document.querySelector('.mega-header');
  if (!header) return;
  const mobileBtn = header.querySelector('.mega-mobile-btn');
  const items = [...header.querySelectorAll('.mega-item')];
  const closeAll = (except) => items.forEach(item => {
    if (item !== except) {
      item.classList.remove('is-open');
      const t = item.querySelector('.mega-trigger'); if (t) t.setAttribute('aria-expanded','false');
    }
  });
  items.forEach(item => {
    const trigger = item.querySelector('.mega-trigger');
    if (!trigger) return;
    trigger.setAttribute('aria-expanded','false');
    trigger.addEventListener('click', e => {
      e.stopPropagation();
      const opening = !item.classList.contains('is-open');
      closeAll(item);
      item.classList.toggle('is-open', opening);
      trigger.setAttribute('aria-expanded', opening ? 'true' : 'false');
    });
    item.addEventListener('mouseenter', () => {
      if (window.matchMedia('(min-width: 981px)').matches) {
        closeAll(item); item.classList.add('is-open'); trigger.setAttribute('aria-expanded','true');
      }
    });
    item.addEventListener('mouseleave', () => {
      if (window.matchMedia('(min-width: 981px)').matches) {
        item.classList.remove('is-open'); trigger.setAttribute('aria-expanded','false');
      }
    });
  });
  if (mobileBtn) mobileBtn.addEventListener('click', e => {
    e.stopPropagation();
    const open = header.classList.toggle('menu-open');
    mobileBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (!open) closeAll();
  });
  document.addEventListener('click', e => {
    if (!header.contains(e.target)) { closeAll(); header.classList.remove('menu-open'); if(mobileBtn) mobileBtn.setAttribute('aria-expanded','false'); }
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeAll(); header.classList.remove('menu-open'); if(mobileBtn) mobileBtn.setAttribute('aria-expanded','false'); }
  });
  header.querySelectorAll('.mega-panel a').forEach(a => a.addEventListener('click', () => {
    header.classList.remove('menu-open'); closeAll(); if(mobileBtn) mobileBtn.setAttribute('aria-expanded','false');
  }));
})();
