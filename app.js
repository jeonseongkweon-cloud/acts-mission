// ACTS Mission Alliance v3.0
// Google Sheets: 파일 > 공유 > 웹에 게시 > CSV 주소를 아래 따옴표 안에 넣으세요.
// 예: window.ACTS_GOOGLE_SHEET_CSV = 'https://docs.google.com/spreadsheets/d/e/.../pub?output=csv';
window.ACTS_GOOGLE_SHEET_CSV = '';

document.querySelectorAll('[data-year]').forEach(el=>el.textContent=new Date().getFullYear());
const mobile=document.querySelector('.mobile'),menu=document.querySelector('.menu');
if(mobile&&menu){mobile.addEventListener('click',()=>{menu.classList.toggle('open')})}
