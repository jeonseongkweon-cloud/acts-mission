
(function(){
  if (document.getElementById('acts-external-sites-dock')) return;
  const style=document.createElement('style');
  style.textContent=`
  #acts-external-sites-dock{position:fixed;right:16px;bottom:16px;z-index:2147483000;font-family:system-ui,-apple-system,"Noto Sans KR",sans-serif}
  #acts-external-sites-dock .ae-toggle{border:1px solid rgba(216,177,90,.5);background:#fff;color:#17233b;border-radius:999px;padding:10px 14px;font-weight:900;box-shadow:0 10px 30px rgba(0,0,0,.18);cursor:pointer}
  #acts-external-sites-dock .ae-panel{display:none;position:absolute;right:0;bottom:48px;width:250px;background:#fff;border:1px solid rgba(0,0,0,.12);border-radius:16px;padding:10px;box-shadow:0 16px 44px rgba(0,0,0,.22)}
  #acts-external-sites-dock.open .ae-panel{display:block}
  #acts-external-sites-dock .ae-title{font-size:11px;color:#9a762b;font-weight:900;padding:4px 6px 8px}
  #acts-external-sites-dock a{display:block;text-decoration:none;color:#17233b;padding:10px;border-radius:10px;font-size:13px;font-weight:800}
  #acts-external-sites-dock a:hover{background:#f4f6f9}
  #acts-external-sites-dock small{display:block;color:#667085;padding:7px 6px 2px;line-height:1.4}
  `;
  document.head.appendChild(style);
  const dock=document.createElement('div'); dock.id='acts-external-sites-dock';
  dock.innerHTML=`<button class="ae-toggle" type="button">관련 전문기관 ↗</button><div class="ae-panel"><div class="ae-title">EXTERNAL PARTNER SITES</div><a href="https://ipma1822-png.github.io/taekwonkumdo/" target="_blank" rel="noopener">태권검도 WTKF ↗</a><a href="https://ipma.kr/" target="_blank" rel="noopener">국제경찰무도연합회 IPMA ↗</a><a href="https://idp.ai.kr/" target="_blank" rel="noopener">국제드론순찰대 IDP ↗</a><small>ACTS와 무도·드론 사이트는 운영 영역을 분리하며, 외부 사이트는 새 창에서 열립니다.</small></div>`;
  document.body.appendChild(dock);
  dock.querySelector('.ae-toggle').onclick=()=>dock.classList.toggle('open');
  document.addEventListener('click',e=>{if(!dock.contains(e.target))dock.classList.remove('open')});
})();
