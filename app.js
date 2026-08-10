document.addEventListener('DOMContentLoaded',()=>{
  const year=document.querySelector('[data-year]'); if(year) year.textContent=new Date().getFullYear();
  document.querySelectorAll('[data-confirm-external]').forEach(a=>a.addEventListener('click',()=>{}));
});
