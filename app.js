document.querySelectorAll('[data-year]').forEach(el=>el.textContent=new Date().getFullYear());
const mobile=document.querySelector('.mobile');
const menu=document.querySelector('.menu');
if(mobile&&menu){mobile.addEventListener('click',()=>{menu.style.display=menu.style.display==='flex'?'none':'flex';menu.style.position='absolute';menu.style.top='72px';menu.style.left='0';menu.style.right='0';menu.style.padding='18px 4%';menu.style.background='#071a2e';menu.style.flexWrap='wrap';});}
