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

  // 휴대전화에서는 주요 메뉴를 가로로 항상 보여주고,
  // 누른 메뉴의 하위 항목을 바로 아래에 펼쳐 보여줍니다.
  const navWrap = header.querySelector('.mega-nav-wrap');
  let mobilePrimary = null;
  let mobilePrimaryPanel = null;
  if (navWrap && !header.querySelector('.acts-mobile-primary')) {
    mobilePrimary = document.createElement('div');
    mobilePrimary.className = 'acts-mobile-primary';
    mobilePrimary.setAttribute('aria-label', '모바일 주요 메뉴');
    mobilePrimary.innerHTML = `
      <div class="acts-mobile-primary-scroll"></div>
      <div class="acts-mobile-more" aria-hidden="true">›</div>
      <div class="acts-mobile-primary-hint">메뉴를 누르면 세부 항목이 펼쳐집니다</div>
      <div class="acts-mobile-primary-panel"></div>`;
    navWrap.insertAdjacentElement('afterend', mobilePrimary);
    mobilePrimaryPanel = mobilePrimary.querySelector('.acts-mobile-primary-panel');
    const quickRow = mobilePrimary.querySelector('.acts-mobile-primary-scroll');
    const moreArrow = mobilePrimary.querySelector('.acts-mobile-more');

    const updateMoreArrow = () => {
      const hasMore = quickRow.scrollLeft + quickRow.clientWidth < quickRow.scrollWidth - 4;
      moreArrow?.classList.toggle('is-hidden', !hasMore);
    };

    items.forEach((item, index) => {
      const sourceTrigger = item.querySelector('.mega-trigger');
      const sourcePanel = item.querySelector('.mega-panel');
      if (!sourceTrigger || !sourcePanel) return;
      const quickButton = document.createElement('button');
      quickButton.type = 'button';
      quickButton.textContent = sourceTrigger.childNodes[0]?.textContent?.trim() || sourceTrigger.textContent.replace('⌄', '').trim();
      quickButton.setAttribute('aria-expanded', 'false');
      quickButton.dataset.menuIndex = String(index);
      quickButton.addEventListener('click', event => {
        event.stopPropagation();
        const wasOpen = quickButton.classList.contains('is-active');
        quickRow.querySelectorAll('button').forEach(button => {
          button.classList.remove('is-active');
          button.setAttribute('aria-expanded', 'false');
        });
        if (wasOpen) {
          mobilePrimaryPanel.classList.remove('is-open');
          mobilePrimaryPanel.replaceChildren();
          return;
        }
        quickButton.classList.add('is-active');
        quickButton.setAttribute('aria-expanded', 'true');
        mobilePrimaryPanel.innerHTML = sourcePanel.innerHTML;
        mobilePrimaryPanel.classList.add('is-open');
      });
      quickRow.appendChild(quickButton);
    });

    quickRow.addEventListener('scroll', updateMoreArrow, { passive: true });
    window.addEventListener('resize', updateMoreArrow, { passive: true });
    requestAnimationFrame(updateMoreArrow);

    mobilePrimaryPanel.addEventListener('click', event => {
      if (!event.target.closest('a')) return;
      mobilePrimaryPanel.classList.remove('is-open');
      quickRow.querySelectorAll('button').forEach(button => {
        button.classList.remove('is-active');
        button.setAttribute('aria-expanded', 'false');
      });
    });
  }

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
      if (mobilePrimaryPanel) {
        mobilePrimaryPanel.classList.remove('is-open');
        mobilePrimary?.querySelectorAll('button').forEach(button => {
          button.classList.remove('is-active');
          button.setAttribute('aria-expanded', 'false');
        });
      }
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

// ACTS 선교연합 공식 운영정보 푸터 — 모든 공개 페이지 공통 적용
(() => {
  const footer = document.querySelector('footer');
  if (!footer || document.querySelector('.acts-registered-info')) return;

  const style = document.createElement('style');
  style.id = 'acts-registered-info-style';
  style.textContent = `
    .acts-registered-info{width:min(1180px,calc(100% - 28px));margin:22px auto 0;padding:22px;border:1px solid rgba(216,177,90,.34);border-radius:18px;background:linear-gradient(135deg,rgba(216,177,90,.12),rgba(6,24,43,.86));color:#eef4ff;box-sizing:border-box}
    .acts-registered-info *{box-sizing:border-box}.acts-registered-head{display:flex;justify-content:space-between;gap:14px;align-items:center;padding-bottom:15px;border-bottom:1px solid rgba(255,255,255,.1)}
    .acts-registered-head small{display:block;color:#d8b15a;font-size:10px;font-weight:900;letter-spacing:.15em}.acts-registered-head b{display:block;margin-top:5px;font-size:18px;color:#fff}
    .acts-registration-no{padding:9px 12px;border-radius:12px;background:#071426;border:1px solid rgba(216,177,90,.36);color:#ead18d;font-weight:900;white-space:nowrap}
    .acts-registered-grid{display:grid;grid-template-columns:1.6fr 1fr 1fr;gap:12px;margin-top:15px}.acts-info-item{padding:12px 13px;border-radius:13px;background:rgba(5,18,33,.62);border:1px solid rgba(255,255,255,.09)}
    .acts-info-item span{display:block;color:#9fb0c7;font-size:10px;font-weight:900;margin-bottom:5px}.acts-info-item p,.acts-info-item a{margin:0;color:#eef4ff;font-size:13px;line-height:1.55;text-decoration:none}.acts-info-item a:hover{color:#d8b15a}
    .acts-registered-note{margin:13px 0 0;color:#9fb0c7;font-size:11px;text-align:center}
    @media(max-width:760px){.acts-registered-head{align-items:flex-start;flex-direction:column}.acts-registered-grid{grid-template-columns:1fr}.acts-registration-no{white-space:normal}}
  `;
  document.head.appendChild(style);

  const info = document.createElement('section');
  info.className = 'acts-registered-info';
  info.setAttribute('aria-label', 'ACTS 선교연합 공식 운영정보');
  info.innerHTML = `
    <div class="acts-registered-head"><div><small>ACTS MISSION ALLIANCE · OFFICIAL INFORMATION</small><b>엑츠선교연합(ACTS) 공식 운영정보</b></div><div class="acts-registration-no">고유번호 413-82-73480</div></div>
    <div class="acts-registered-grid">
      <div class="acts-info-item"><span>HEADQUARTERS · 본부 주소</span><p>울산광역시 남구 중앙로290번길 53<br>강변센트럴하이츠 상가 203호</p></div>
      <div class="acts-info-item"><span>CONTACT · 연락처</span><p><a href="tel:01044772772">010-4477-2772</a><br><a href="tel:+8228221822">국제전화 +82-2-822-1822</a></p></div>
      <div class="acts-info-item"><span>EMAIL · 공식 이메일</span><p><a href="mailto:jeonseongkweon@gmail.com">jeonseongkweon@gmail.com</a></p></div>
    </div>
    <p class="acts-registered-note">ACTS 선교연합은 고유번호를 발급받은 등록단체로서 책임 있고 투명한 선교 협력을 지향합니다.</p>
  `;
  footer.appendChild(info);
})();
