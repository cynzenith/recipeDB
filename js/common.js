// 웹페이지 메인화면에 대한 자바스크립트

let navMenus = document.querySelectorAll('nav.nav-menu a');
navMenus.forEach(item => item.addEventListener('click', e => showNavMenu(e)));
let previousNavCategory = null;

function showNavMenu(e) {
  let currentNavCategory = e.currentTarget;
  console.log(currentNavCategory, currentNavCategory.textContent);

  if (previousNavCategory) {
    previousNavCategory.classList.remove('active-nav');
  }
  currentNavCategory.classList.add('active-nav');
  previousNavCategory = currentNavCategory;
}
