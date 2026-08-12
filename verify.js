/* ACTS Verification v3.0
   구글시트 연결 시 app.js의 ACTS_GOOGLE_SHEET_CSV 값에 '웹에 게시된 CSV 주소'를 넣으면 됩니다.
*/
const DEMO_RECORDS = [{
  ACTS_ID:'ACTS-MI-20260801-0001', NAME_KR:'전성권', NAME_EN:'JEON SEONG KWEON',
  COUNTRY:'Republic of Korea', ORGANIZATION:'', DENOMINATION:'대한예수교장로회',
  CERTIFICATE:'Missionary Instructor', PROGRAM:'TAEGEOM Mission Instructor',
  ISSUE_DATE:'2026-08-01', EXPIRY_DATE:'2028-07-31', POSITION:'Mission Instructor',
  MISSION_AREA:'Korea', STATUS:'ACTIVE', PHOTO_URL:''
}];
function parseCSV(text){
  const rows=[];let row=[],cell='',q=false;
  for(let i=0;i<text.length;i++){const c=text[i],n=text[i+1];if(c==='"'){if(q&&n==='"'){cell+='"';i++;}else q=!q;}else if(c===','&&!q){row.push(cell);cell='';}else if((c==='\n'||c==='\r')&&!q){if(c==='\r'&&n==='\n')i++;row.push(cell);cell='';if(row.some(x=>x!==''))rows.push(row);row=[];}else cell+=c;}
  if(cell||row.length){row.push(cell);rows.push(row)} if(rows.length<2)return[];
  const h=rows[0].map(x=>x.trim());return rows.slice(1).map(r=>Object.fromEntries(h.map((k,i)=>[k,(r[i]||'').trim()])));
}
async function loadRecords(){
  const url=(window.ACTS_GOOGLE_SHEET_CSV||'').trim(); if(!url)return DEMO_RECORDS;
  try{const res=await fetch(url,{cache:'no-store'});if(!res.ok)throw new Error('fetch');const data=parseCSV(await res.text());return data.length?data:DEMO_RECORDS;}catch(e){return DEMO_RECORDS;}
}
function safe(v){return (v||'-').replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));}
function statusClass(s){s=(s||'').toUpperCase();return s==='ACTIVE'?'active-status':s==='EXPIRED'?'expired-status':'warning-status';}
async function verify(){
  const input=document.getElementById('verifyId'),box=document.getElementById('verifyResult');const id=input.value.trim().toUpperCase();
  if(!id){box.className='verify-result error';box.innerHTML='<div class="verify-icon">!</div><h2>ACTS ID를 입력해 주세요.</h2>';return;}
  box.className='verify-result loading';box.innerHTML='<div class="spinner"></div><h2>등록정보를 확인하고 있습니다…</h2>';
  const rows=await loadRecords();const r=rows.find(x=>(x.ACTS_ID||'').trim().toUpperCase()===id);
  if(!r){box.className='verify-result error';box.innerHTML='<div class="verify-icon">×</div><h2>등록 정보를 찾을 수 없습니다.</h2><p>ACTS ID를 다시 확인하거나 본부 Verification Center로 문의해 주세요.</p>';return;}
  const st=(r.STATUS||'ACTIVE').toUpperCase();
  box.className='verify-result success';box.innerHTML=`<div class="verified-head"><div class="verify-icon">✓</div><div><span class="verified-label">VERIFIED</span><h2>${safe(r.NAME_KR)} <small>${safe(r.NAME_EN)}</small></h2></div><span class="status-pill ${statusClass(st)}">${safe(st)}</span></div>
  <div class="credential-grid"><div><span>ACTS ID</span><b>${safe(r.ACTS_ID)}</b></div><div><span>Country</span><b>${safe(r.COUNTRY)}</b></div><div><span>Credential</span><b>${safe(r.CERTIFICATE)}</b></div><div><span>Program</span><b>${safe(r.PROGRAM)}</b></div><div><span>Position</span><b>${safe(r.POSITION)}</b></div><div><span>Mission Area</span><b>${safe(r.MISSION_AREA)}</b></div><div><span>Issued</span><b>${safe(r.ISSUE_DATE)}</b></div><div><span>Valid Until</span><b>${safe(r.EXPIRY_DATE)}</b></div></div>
  <div class="verified-foot">ACTS Mission Alliance Headquarters · Global Credential Verification</div>`;
}
document.getElementById('verifyBtn').addEventListener('click',verify);document.getElementById('verifyId').addEventListener('keydown',e=>{if(e.key==='Enter')verify()});document.getElementById('sampleId').addEventListener('click',()=>{document.getElementById('verifyId').value='ACTS-MI-20260801-0001';verify()});
