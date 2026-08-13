// ACTS MISSION ALLIANCE v5.1.1
// Stable Mega Menu — hover bridge & delayed close

(() => {
  const header = document.querySelector('.mega-header');
  if (!header) return;

  const mobileBtn = header.querySelector('.mega-mobile-btn');
  const items = [...header.querySelectorAll('.mega-item')];

  const isDesktop = () =>
    window.matchMedia('(min-width: 981px)').matches;

  const closeTimers = new WeakMap();

  function clearCloseTimer(item) {
    const timer = closeTimers.get(item);
    if (timer) {
      clearTimeout(timer);
      closeTimers.delete(item);
    }
  }

  function setOpen(item, open) {
    const trigger = item.querySelector('.mega-trigger');

    item.classList.toggle('is-open', open);

    if (trigger) {
      trigger.setAttribute(
        'aria-expanded',
        open ? 'true' : 'false'
      );
    }
  }

  function closeAll(except = null) {
    items.forEach(item => {
      if (item === except) return;

      clearCloseTimer(item);
      setOpen(item, false);
    });
  }

  function scheduleClose(item) {
    clearCloseTimer(item);

    const timer = setTimeout(() => {
      const panel = item.querySelector('.mega-panel');

      const itemHovered = item.matches(':hover');
      const panelHovered = panel && panel.matches(':hover');

      // 상단 메뉴 또는 펼쳐진 메뉴 위에
      // 마우스가 있으면 닫지 않는다.
      if (itemHovered || panelHovered) return;

      setOpen(item, false);
    }, 400);

    closeTimers.set(item, timer);
  }

  items.forEach(item => {
    const trigger = item.querySelector('.mega-trigger');
    const panel = item.querySelector('.mega-panel');

    if (!trigger) return;

    trigger.setAttribute('aria-expanded', 'false');

    // 클릭 방식
    trigger.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();

      const opening =
        !item.classList.contains('is-open');

      closeAll(item);
      setOpen(item, opening);
    });

    // PC : 상단 메뉴에 마우스를 올리면 펼침
    item.addEventListener('mouseenter', () => {
      if (!isDesktop()) return;

      clearCloseTimer(item);
      closeAll(item);
      setOpen(item, true);
    });

    // 바로 닫지 않고 잠시 기다림
    item.addEventListener('mouseleave', () => {
      if (!isDesktop()) return;

      scheduleClose(item);
    });

    // 펼쳐진 흰색 메뉴로 마우스가 내려오면
    // 닫기 예약을 취소
    if (panel) {
      panel.addEventListener('mouseenter', () => {
        clearCloseTimer(item);
        setOpen(item, true);
      });

      panel.addEventListener('mouseleave', () => {
        if (!isDesktop()) return;

        scheduleClose(item);
      });
    }
  });

  // 모바일 메뉴
  if (mobileBtn) {
    mobileBtn.addEventListener('click', e => {
      e.stopPropagation();

      const open =
        header.classList.toggle('menu-open');

      mobileBtn.setAttribute(
        'aria-expanded',
        open ? 'true' : 'false'
      );

      if (!open) closeAll();
    });
  }

  // 메가메뉴 밖을 클릭했을 때 닫기
  document.addEventListener('click', e => {
    if (!header.contains(e.target)) {
      closeAll();

      header.classList.remove('menu-open');

      if (mobileBtn) {
        mobileBtn.setAttribute(
          'aria-expanded',
          'false'
        );
      }
    }
  });

  // ESC 키
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeAll();

      header.classList.remove('menu-open');

      if (mobileBtn) {
        mobileBtn.setAttribute(
          'aria-expanded',
          'false'
        );
      }
    }
  });

  // 실제 메뉴를 클릭한 뒤에만 닫기
  header
    .querySelectorAll('.mega-panel a')
    .forEach(a => {
      a.addEventListener('click', () => {
        header.classList.remove('menu-open');
        closeAll();

        if (mobileBtn) {
          mobileBtn.setAttribute(
            'aria-expanded',
            'false'
          );
        }
      });
    });
})();
