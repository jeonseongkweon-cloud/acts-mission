// ACTS MISSION ALLIANCE — shared menu loader + homepage GLOBAL NETWORK display
(() => {
  const injectGlobalNetwork = () => {
    const path = location.pathname.replace(/\/+$/, '') || '/';
    const isHome = path === '/' || path === '/index.html';
    if (!isHome || document.getElementById('acts-global-network')) return;

    const footer = document.querySelector('footer');
    if (!footer) return;

    const style = document.createElement('style');
    style.id = 'acts-global-network-style';
    style.textContent = `
      .acts-global-network{
        position:relative;overflow:hidden;text-align:center;
        padding:54px 20px 50px;
        background:radial-gradient(circle at 50% 38%,rgba(228,181,70,.15),transparent 42%),linear-gradient(180deg,#071a2d 0%,#04111f 100%);
        border-top:1px solid rgba(226,184,82,.22);border-bottom:1px solid rgba(226,184,82,.16);
        color:#fff;
      }
      .acts-global-network::before{
        content:"";position:absolute;inset:-80% -30%;pointer-events:none;
        background:linear-gradient(110deg,transparent 42%,rgba(255,226,143,.13) 50%,transparent 58%);
        animation:actsNetworkShine 6s ease-in-out infinite;
      }
      .acts-global-network__eyebrow{position:relative;z-index:1;color:#dfbd67;font-size:13px;font-weight:900;letter-spacing:.24em;margin-bottom:8px}
      .acts-global-network__number{
        position:relative;z-index:1;display:inline-block;
        font-size:clamp(58px,9vw,100px);line-height:1;font-weight:950;letter-spacing:-.045em;
        color:#f3cf70;
        text-shadow:0 0 12px rgba(244,201,91,.45),0 0 34px rgba(244,201,91,.22);
        animation:actsNetworkPulse 2.8s ease-in-out infinite;
      }
      .acts-global-network__message{position:relative;z-index:1;margin:15px auto 0;color:#eaf1f8;font-size:clamp(15px,2.4vw,20px);font-weight:750;letter-spacing:-.02em}
      .acts-global-network__sub{position:relative;z-index:1;margin:7px auto 0;color:#8fa4b9;font-size:11px;letter-spacing:.16em}
      @keyframes actsNetworkPulse{
        0%,100%{transform:scale(1);filter:brightness(1)}
        50%{transform:scale(1.055);filter:brightness(1.18)}
      }
      @keyframes actsNetworkShine{
        0%,35%{transform:translateX(-28%);opacity:0}
        48%{opacity:1}
        62%,100%{transform:translateX(28%);opacity:0}
      }
      @media(max-width:640px){
        .acts-global-network{padding:40px 16px 38px}
        .acts-global-network__eyebrow{font-size:11px;letter-spacing:.2em}
        .acts-global-network__message{line-height:1.55}
      }
      @media(prefers-reduced-motion:reduce){
        .acts-global-network::before,.acts-global-network__number{animation:none!important}
      }
    `;
    document.head.appendChild(style);

    const section = document.createElement('section');
    section.id = 'acts-global-network';
    section.className = 'acts-global-network';
    section.setAttribute('aria-label', 'ACTS 글로벌 네트워크');
    section.innerHTML = `
      <div class="acts-global-network__eyebrow">GLOBAL NETWORK</div>
      <div class="acts-global-network__number">2,477</div>
      <p class="acts-global-network__message">전 세계를 연결하는 ACTS MISSION ALLIANCE</p>
      <p class="acts-global-network__sub">CONNECTED FOR A BRIGHTER WORLD</p>`;
    footer.insertAdjacentElement('beforebegin', section);
  };

  const core = document.createElement('script');
  core.src = '/mega-menu-core.js?v=5.1.6';
  core.onload = injectGlobalNetwork;
  core.onerror = injectGlobalNetwork;
  document.head.appendChild(core);
})();
