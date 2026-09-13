// ACTS MISSION ALLIANCE v5.1.6 — SIMPLE DESKTOP MEGA MENU + MEMBER ACCESS
// Desktop: keep the first horizontal navigation compact and move secondary areas into one All Menu.
(() => {
  const header = document.querySelector('.mega-header');
  if (!header) return;

  const desktopMQ = window.matchMedia('(min-width: 981px)');
  const mobileBtn = header.querySelector('.mega-mobile-btn');
  const menu = header.querySelector('#megaMenu');

  // ACTS MISSION TOOLS: shared navigation injected on every page that uses this menu script.
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

    const prayerTrigger = [...menu.querySelectorAll('.mega-trigger')]
      .find(btn => btn.textContent.includes('기도센터'));
    const prayerItem = prayerTrigger?.closest('.mega-item');
    if (prayerItem) menu.insertBefore(item, prayerItem);
    else menu.appendChild(item);
  }

  // 관리자 로그인은 상단에 별도 버튼을 만들지 않고 '참여하기' 메가메뉴 안에 둡니다.
  if (menu && !menu.querySelector('[data-acts-admin-link]')) {
    const joinTrigger = [...menu.querySelectorAll('.mega-trigger')]
      .find(btn => btn.textContent.includes('참여하기'));
    const joinPanel = joinTrigger?.closest('.mega-item')?.querySelector('.mega-panel');
    if (joinPanel) {
      const sections = joinPanel.querySelectorAll('section');
      const target = sections[sections.length - 1] || joinPanel;
      const adminLink = document.createElement('a');
      adminLink.href = '/admin.html';
      adminLink.setAttribute('data-acts-admin-link', 'true');
      adminLink.textContent = '⚙ 관리자 로그인';
      adminLink.title = 'ACTS 관리자 로그인';
      target.appendChild(adminLink);
    }
  }

  // 상단 로그인 메뉴: 신규 가입, 기존 로그인, 아이디 안내, 비밀번호 재설정을 한 곳에서 제공합니다.
  if (menu && !menu.querySelector('[data-login-menu]')) {
    const loginItem = document.createElement('div');
    loginItem.className = 'mega-item acts-login-menu-item';
    loginItem.setAttribute('data-login-menu', 'true');
    loginItem.setAttribute('data-primary-top', 'true');
    loginItem.innerHTML = `
      <button class="mega-trigger acts-login-trigger" type="button">로그인 <span>⌄</span></button>
      <div class="mega-panel mega-panel-3 acts-login-panel">
        <section class="acts-login-main">
          <h3>MEMBER LOGIN · 회원 로그인</h3>
          <a class="acts-member-strong" href="/member-center/login.html">🔐 통합회원 로그인</a>
          <a class="acts-member-strong" href="/member-center/signup.html">✨ 처음 오셨나요? 회원가입</a>
          <a href="/member-center/mypage.html">MY PAGE</a>
        </section>
        <section>
          <h3>ACCOUNT HELP · 계정 도움</h3>
          <a href="/member-center/account-help.html#id-help">아이디(가입 이메일) 안내</a>
          <a href="/member-center/account-help.html#password-reset">비밀번호 재설정</a>
          <p class="acts-login-note">ACTS 통합계정의 아이디는 가입할 때 사용한 이메일입니다.</p>
        </section>
        <section>
          <h3>FIRST VISIT · 처음 오신 분</h3>
          <a href="/participation.html">ACTS 참여 안내</a>
          <a href="/member-center/signup.html">통합회원 가입 시작</a>
          <a href="/admin.html">⚙ 관리자 로그인</a>
        </section>
      </div>`;
    menu.prepend(loginItem);
  }

  // 참여하기 메가메뉴 최상단에도 회원 접근 동선을 유지합니다.
  if (menu) {
    const joinTrigger = [...menu.querySelectorAll('.mega-trigger')]
      .find(btn => btn.textContent.includes('참여하기'));
    const joinPanel = joinTrigger?.closest('.mega-item')?.querySelector('.mega-panel');
    if (joinPanel && !joinPanel.querySelector('[data-member-quick]')) {
      const quick = document.createElement('section');
      quick.setAttribute('data-member-quick', 'true');
      quick.className = 'acts-member-quick';
      quick.innerHTML = `
        <h3>MEMBER · 회원</h3>
        <a class="acts-member-strong" href="/member-center/signup.html">✨ 통합회원 가입</a>
        <a class="acts-member-strong" href="/member-center/login.html">🔐 통합회원 로그인</a>
        <a href="/member-center/mypage.html">MY PAGE</a>
        <a href="/participation.html">ACTS 참여 안내</a>`;
      joinPanel.prepend(quick);
    }
  }

  // 데스크톱 상단은 로그인 / 소개 / 소통센터 / 참여하기 / 전체메뉴만 보이게 정리합니다.
  // 숨기는 것이 아니라 기존 메뉴 패널들을 전체메뉴에 복제해 접근성을 그대로 보존합니다.
  if (menu && !menu.querySelector('[data-all-menu]')) {
    const allItem = document.createElement('div');
    allItem.className = 'mega-item acts-all-menu-item';
    allItem.setAttribute('data-all-menu', 'true');
    allItem.innerHTML = `
      <button class="mega-trigger" type="button">전체메뉴 <span>⌄</span></button>
      <div class="mega-panel mega-panel-4 acts-all-menu-panel"></div>`;

    const allPanel = allItem.querySelector('.acts-all-menu-panel');
    const keepTop = ['로그인', '소개', '소통센터', '참여하기'];
    const currentItems = [...menu.querySelectorAll(':scope > .mega-item')];

    currentItems.forEach(item => {
      const trigger = item.querySelector(':scope > .mega-trigger');
      const panel = item.querySelector(':scope > .mega-panel');
      if (!trigger || !panel) return;
      const label = (trigger.childNodes[0]?.textContent || trigger.textContent).replace('⌄', '').trim();
      if (keepTop.some(name => label.includes(name))) {
        item.setAttribute('data-primary-top', 'true');
        return;
      }

      item.setAttribute('data-secondary-top', 'true');
      const section = document.createElement('section');
      const title = document.createElement('h3');
      title.textContent = label;
      section.appendChild(title);

      panel.querySelectorAll('a').forEach(link => {
        const cloned = link.cloneNode(true);
        section.appendChild(cloned);
      });

      if (section.querySelector('a')) allPanel.appendChild(section);
    });

    menu.appendChild(allItem);
  }

  // 데스크톱 가로 메뉴 정리 스타일. 모바일에서는 기존 전체 메뉴 구조를 유지합니다.
  if (!document.getElementById('acts-simple-nav-style')) {
    const style = document.createElement('style');
    style.id = 'acts-simple-nav-style';
    style.textContent = `
      @media(min-width:981px){
        #megaMenu > .mega-item[data-secondary-top="true"]{display:none!important}
        #megaMenu > .mega-item[data-primary-top="true"],
        #megaMenu > .mega-item[data-all-menu="true"]{display:block!important}
        .acts-all-menu-panel{grid-template-columns:repeat(4,minmax(0,1fr))!important;max-height:72vh;overflow:auto}
        .acts-member-quick,.acts-login-main{background:linear-gradient(180deg,#fff9e9,#fff);border-radius:12px;padding:14px!important;border:1px solid rgba(196,143,37,.25)}
        .acts-member-quick .acts-member-strong,.acts-login-panel .acts-member-strong{font-weight:900;color:#8b6114!important}
        .acts-login-note{font-size:12px;line-height:1.6;color:#667085;margin:9px 0 0}
        .acts-login-trigger{color:#e5b74f!important;font-weight:900!important}
      }
      @media(max-width:980px){
        #megaMenu > .mega-item[data-secondary-top="true"]{display:block!important}
        #megaMenu > .mega-item[data-all-menu="true"]{display:none!important}
      }
      @media(max-width:1200px) and (min-width:981px){.acts-all-menu-panel{grid-template-columns:repeat(3,minmax(0,1fr))!important}}
    `;
    document.head.appendChild(style);
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
      if (item.matches('[data-all-menu]')) return;
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

    trigger.addEventListener('mouseenter', () => {
      if (!desktopMQ.matches) return;
      closeAll(item);
      setOpen(item, true);
    });

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