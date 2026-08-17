// ACTS MISSION ALLIANCE v5.1.3 — STICKY DESKTOP MEGA MENU
// Desktop: hover/click opens a menu and it stays open until another menu,
// an outside click, Escape, or a submenu link is selected.
(() => {
  const header = document.querySelector('.mega-header');
  if (!header) return;

  const desktopMQ = window.matchMedia('(min-width: 981px)');
  const mobileBtn = header.querySelector('.mega-mobile-btn');

  // ACTS MISSION TOOLS: shared navigation injected on every page that uses this menu script.
  // This avoids editing dozens of duplicated HTML headers individually.
  const menu = header.querySelector('#megaMenu');
  if (menu && !menu.querySelector('[data-mission-tools-menu]')) {
    const item = document.createElement('div');
    item.className = 'mega-item';
    item.setAttribute('data-mission-tools-menu', 'true');
    item.innerHTML = `
      <button class="mega-trigger" type="button">MISSION TOOLS <span>⌄</span></button>
      <div class="mega-panel mega-panel-3">
        <section>
          <h3>MISSION TOOLS</h3>
          <a href="mission-tools.html">선교도구 안내</a>
          <a href="mission-tools.html#free-for-mission">FREE FOR MISSION</a>
        </section>
        <section>
          <h3>TAEKWONKUMDO</h3>
          <a href="taekwonkumdo-mission.html">태권검도 선교교육</a>
          <a href="taekwonkumdo-mission.html#materials">무료 교본·영상</a>
          <a href="taekwonkumdo-mission.html#training">교육·지도자 과정</a>
        </section>
        <section>
          <h3>SELF-DEFENSE</h3>
          <a href="self-defense-mission.html">호신술 선교교육</a>
          <a href="self-defense-mission.html#curriculum">기초 교육과정</a>
          <a href="self-defense-mission.html#mission-use">선교현장 활용</a>
        </section>
      </div>`;

    // Place it immediately before Prayer Center when possible.
    const prayerTrigger = [...menu.querySelectorAll('.mega-trigger')]
      .find(btn => btn.textContent.includes('기도센터'));
    const prayerItem = prayerTrigger?.closest('.mega-item');
    if (prayerItem) menu.insertBefore(item, prayerItem);
    else menu.appendChild(item);
  }

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
