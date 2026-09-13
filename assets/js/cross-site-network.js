
(function(){
  const path=location.pathname;
  const isAdminPage=/(^|\/)admin(?:-dashboard|-posts)?\.html$/i.test(path);
  const isCommunityPage=/\/community-board\.html$/i.test(path);
  const isPostDetail=/\/post-detail\.html$/i.test(path);

  function getActsClient(){
    try{
      if(!window.supabase) return null;
      const scripts=[...document.scripts].map(s=>s.textContent||'').join('\n');
      const urlMatch=scripts.match(/https:\/\/[a-z0-9]+\.supabase\.co/i);
      const keyMatch=scripts.match(/sb_publishable_[A-Za-z0-9_\-]+/);
      if(!urlMatch||!keyMatch) return null;
      return window.supabase.createClient(urlMatch[0],keyMatch[0]);
    }catch(error){
      console.error('ACTS Supabase client error:',error);
      return null;
    }
  }

  async function enforceActsAdmin(){
    if(!isAdminPage) return;
    try{
      const client=getActsClient();
      if(!client){
        console.error('ACTS admin guard: Supabase config not found');
        return;
      }
      const {data:{session},error:sessionError}=await client.auth.getSession();
      if(sessionError||!session){
        if(!/\/admin\.html$/i.test(path)) location.replace('/admin.html');
        return;
      }
      const {data:isAdmin,error:adminError}=await client.rpc('acts_is_admin');
      if(adminError||isAdmin!==true){
        await client.auth.signOut();
        if(/\/admin\.html$/i.test(path)){
          const msg=document.getElementById('message');
          if(msg) msg.textContent='ACTS 관리자 권한이 없는 계정입니다.';
        }else{
          location.replace('/admin.html?denied=1');
        }
      }
    }catch(error){
      console.error('ACTS admin guard error:',error);
      if(!/\/admin\.html$/i.test(path)) location.replace('/admin.html');
    }
  }

  function addGrandOpenStyles(){
    if(document.getElementById('acts-grand-open-style')) return;
    const style=document.createElement('style');
    style.id='acts-grand-open-style';
    style.textContent=`
      .acts-community-compose{background:#fff;border:1px solid #e5e7eb;border-top:4px solid #d6ae55;border-radius:14px;padding:20px;margin:0 0 24px;box-shadow:0 4px 16px rgba(0,0,0,.05)}
      .acts-community-compose h3{margin:0 0 7px;color:#061A33;font-size:19px}
      .acts-community-compose p{margin:0 0 14px;color:#667085;font-size:13px;line-height:1.6}
      .acts-community-compose input,.acts-community-compose textarea{width:100%;border:1px solid #d8dee7;border-radius:9px;padding:11px 12px;font:inherit;outline:none;background:#fff}
      .acts-community-compose textarea{min-height:120px;resize:vertical;margin-top:9px;line-height:1.6}
      .acts-community-compose input:focus,.acts-community-compose textarea:focus{border-color:#d6ae55;box-shadow:0 0 0 3px rgba(214,174,85,.12)}
      .acts-compose-actions{display:flex;gap:9px;align-items:center;flex-wrap:wrap;margin-top:10px}
      .acts-compose-btn,.acts-login-cta{border:0;border-radius:9px;padding:10px 15px;background:#061A33;color:#fff;font-weight:800;cursor:pointer;text-decoration:none;display:inline-flex;align-items:center;justify-content:center}
      .acts-compose-btn:hover,.acts-login-cta:hover{background:#0B2B50}
      .acts-compose-status{font-size:12px;font-weight:700;color:#6b7280}
      .acts-report-wrap{margin-top:18px;padding-top:14px;border-top:1px solid #eef1f5;display:flex;justify-content:flex-end}
      .acts-report-btn{border:1px solid #d8dee7;background:#fff;color:#667085;border-radius:999px;padding:7px 12px;font-size:12px;font-weight:800;cursor:pointer}
      .acts-report-btn:hover{border-color:#b42318;color:#b42318;background:#fff8f7}
      @media(max-width:700px){.acts-community-compose{padding:16px}.acts-compose-btn,.acts-login-cta{width:100%;min-height:44px}.acts-report-wrap{justify-content:flex-start}}
    `;
    document.head.appendChild(style);
  }

  async function setupCommunityWriter(){
    if(!isCommunityPage||document.getElementById('actsCommunityCompose')) return;
    const toolbar=document.querySelector('.board-toolbar');
    if(!toolbar) return;
    const client=getActsClient();
    if(!client) return;
    addGrandOpenStyles();

    const box=document.createElement('section');
    box.className='acts-community-compose';
    box.id='actsCommunityCompose';
    toolbar.parentNode.insertBefore(box,toolbar);

    const {data:{session}}=await client.auth.getSession();
    if(!session){
      box.innerHTML=`<h3>🤝 ACTS 가족 이야기 나누기</h3><p>회원소통 글쓰기는 로그인한 ACTS 회원이 이용할 수 있습니다.</p><a class="acts-login-cta" href="/member-center/login.html?redirect=%2Fcommunity-board.html">회원 로그인 후 글쓰기</a>`;
      return;
    }

    const meta=session.user.user_metadata||{};
    const defaultAuthor=meta.full_name||meta.name||meta.display_name||(session.user.email||'ACTS 회원').split('@')[0];
    box.innerHTML=`
      <h3>🤝 ACTS 가족 이야기 나누기</h3>
      <p>인사, 협력 요청, 지역 소식, 함께 나누고 싶은 이야기를 올려주세요. 개인정보와 광고성 내용은 올리지 말아주세요.</p>
      <input id="actsCommunityTitle" maxlength="120" placeholder="제목을 입력하세요">
      <textarea id="actsCommunityContent" maxlength="5000" placeholder="내용을 입력하세요"></textarea>
      <div class="acts-compose-actions">
        <button type="button" class="acts-compose-btn" id="actsCommunitySubmit">글 등록</button>
        <span class="acts-compose-status" id="actsCommunityStatus"></span>
      </div>`;

    const submit=box.querySelector('#actsCommunitySubmit');
    const status=box.querySelector('#actsCommunityStatus');
    submit.addEventListener('click',async()=>{
      const title=box.querySelector('#actsCommunityTitle').value.trim();
      const content=box.querySelector('#actsCommunityContent').value.trim();
      if(title.length<2||content.length<5){status.textContent='제목과 내용을 조금 더 입력해 주세요.';return;}
      submit.disabled=true;
      status.textContent='등록 중입니다...';
      try{
        const {error}=await client.from('posts').insert({
          category:'community',
          title,
          content,
          author:String(defaultAuthor).slice(0,80),
          user_id:session.user.id,
          is_published:true,
          moderation_status:'visible'
        });
        if(error) throw error;
        box.querySelector('#actsCommunityTitle').value='';
        box.querySelector('#actsCommunityContent').value='';
        status.textContent='등록되었습니다.';
        if(typeof window.loadPosts==='function') await window.loadPosts();
        else setTimeout(()=>location.reload(),500);
      }catch(error){
        console.error('ACTS community insert error:',error);
        status.textContent='등록하지 못했습니다. 로그인 상태를 확인해 주세요.';
      }finally{
        submit.disabled=false;
      }
    });
  }

  async function submitPostReport(postId){
    const client=getActsClient();
    if(!client) return;
    const {data:{session}}=await client.auth.getSession();
    if(!session){
      if(confirm('게시글 신고는 로그인한 회원만 가능합니다. 로그인 페이지로 이동할까요?')){
        const returnTo=encodeURIComponent(location.pathname+location.search);
        location.href='/member-center/login.html?redirect='+returnTo;
      }
      return;
    }
    const reason=prompt('신고 사유를 입력해주세요.\n예: 광고·스팸 / 개인정보 노출 / 부적절한 내용 / 기타');
    if(!reason) return;
    const clean=reason.trim().slice(0,120);
    if(clean.length<2) return;
    try{
      const {error}=await client.from('acts_post_reports').insert({
        post_id:Number(postId),
        reporter_user_id:session.user.id,
        reason:clean
      });
      if(error){
        if(error.code==='23505'){alert('이미 신고한 게시글입니다.');return;}
        throw error;
      }
      alert('신고가 접수되었습니다. ACTS 운영진이 확인하겠습니다.');
    }catch(error){
      console.error('ACTS post report error:',error);
      alert('신고를 접수하지 못했습니다. 잠시 후 다시 시도해주세요.');
    }
  }

  function setupPostReport(){
    if(!isPostDetail) return;
    addGrandOpenStyles();
    const params=new URLSearchParams(location.search);
    const postId=params.get('id');
    if(!postId||!/^[0-9]+$/.test(postId)) return;
    const root=document.getElementById('detailRoot');
    if(!root) return;

    const inject=()=>{
      const card=root.querySelector('.detail-card');
      if(!card||card.querySelector('.acts-report-wrap')) return false;
      const wrap=document.createElement('div');
      wrap.className='acts-report-wrap';
      wrap.innerHTML='<button type="button" class="acts-report-btn">⚑ 신고하기</button>';
      wrap.querySelector('button').addEventListener('click',()=>submitPostReport(postId));
      card.appendChild(wrap);
      return true;
    };
    if(inject()) return;
    const observer=new MutationObserver(()=>{if(inject()) observer.disconnect();});
    observer.observe(root,{childList:true,subtree:true});
  }

  enforceActsAdmin();
  setupCommunityWriter();
  setupPostReport();

  if(document.getElementById('acts-external-sites-dock')) return;
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
