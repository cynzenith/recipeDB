const API_KEY = `7109179c29414b97985b`;
const serviceId = 'COOKRCP01';
const dataType = 'json';
const pageSize = 6; // 페이지당 항목 수
const groupSize = 5; // 그룹당 페이지 수

let recipes = [];
let totalResults = 0;
let page = 1; // 현재 페이지
let currentCategory = '밥'; // 현재 선택된 카테고리

// 페이지에 따라 startIdx와 endIdx 계산
const getStartIdx = (page, pageSize) => (page - 1) * pageSize + 1;
const getEndIdx = (page, pageSize) => page * pageSize;

// URL을 바탕으로 레시피 데이터를 가져오는 함수
const getRecipes = async (category = currentCategory) => {
  try {
    const startIdx = getStartIdx(page, pageSize);
    const endIdx = getEndIdx(page, pageSize);
    
    let url_object = new URL(
      `https://charming-cactus-400740.netlify.app/api/${API_KEY}/${serviceId}/${dataType}/${startIdx}/${endIdx}/RCP_PAT2=${encodeURIComponent(category)}`
    );

    const response = await fetch(url_object); // API 호출
    const data = await response.json(); // JSON 데이터 파싱
    console.log(data); //
    totalResults = data.COOKRCP01.total_count; // 총 레시피 수
    console.log(totalResults); //
    recipes = data.COOKRCP01.row; // 레시피 데이터 저장

    render(); // 화면에 레시피 데이터 렌더링
    renderPagination(); // 페이지네이션 렌더링

    // 페이지 상단으로 스크롤
    window.scrollTo({ top: 0, behavior: 'smooth' });

  } catch (error) {
    console.error('Error fetching recipes:', error);
    displayErrorMessage(error.message);
  }
};

// 레시피 데이터를 바탕으로 HTML을 작성하여 화면에 출력하는 함수
const render = () => {
  if (!recipes || recipes.length === 0) {
    displayErrorMessage('해당 레시피는 존재하지 않습니다.');
    return;
  }

  const recipeHTML = recipes.map(item => {
    let manualStepsHTML = '';
    let stepCounter = 1;

    for (let i = 1; i <= 20; i++) {
      let number = i < 10 ? '0' + i : i;
      let manualNum = item['MANUAL' + number];
      if (manualNum && manualNum.trim() !== '') {
        manualNum = manualNum.replace(/^\d+/, stepCounter);
        manualStepsHTML += `<p><strong>Step ${manualNum}</strong></p>`;
        stepCounter++;
      }
    }

    const partsDetails = item.RCP_PARTS_DTLS.replace(/●/g, '');

    return `
      <div class="row recipe">
          <div class="col-lg-4 col-md-6 recipe-img">
            <div class="recipe-img-div">
              <img class="img-size img-fluid img-shadow" src="${item.ATT_FILE_NO_MAIN}" alt="" />
            </div>
          </div>
          <div class="col-lg-8 col-md-6">
              <h2 class="recipe-title">${item.RCP_NM}</h2>
              <div class="mb-3 recipe-details">${partsDetails}</div>
              <div class="recipe-manual">${manualStepsHTML}</div>
          </div>
      </div>
    `;
  });

  document.getElementById('recipe-board').innerHTML = recipeHTML.join('');
};

// 페이지네이션 버튼 생성 함수
const renderPagination = () => {
  const totalPage = Math.ceil(totalResults / pageSize);
  const pageGroup = Math.ceil(page / groupSize);
  const last = pageGroup * groupSize;
  const first = last - (groupSize - 1);

  const nextPageGroupFirst = last + 1;
  const prevPageGroupFirst = first - groupSize;

  const pageButtons = [];
  
  for (let i = first; i <= Math.min(last, totalPage); i++) {
    pageButtons.push(`<li class="page-item ${i === page ? 'active' : ''}">
      <a class="page-link" href="#">${i}</a></li>`);
  }

  const firstButton = pageGroup > 1
    ? `<li class="page-item"><a class="page-link" href="#" data-action="first"><i class="fas fa-angle-double-left"></i></a></li>`
    : '';

  const prevButton = page > 1
    ? `<li class="page-item"><a class="page-link" href="#" data-action="prev"><i class="fas fa-angle-left"></i></a></li>`
    : '';

  const nextButton = last < totalPage
    ? `<li class="page-item"><a class="page-link" href="#" data-action="next"><i class="fas fa-angle-right"></i></a></li>`
    : '';

  const lastPageButton = last < totalPage
    ? `<li class="page-item"><a class="page-link" href="#" data-action="last"><i class="fas fa-angle-double-right"></i></a></li>`
    : '';

  document.getElementById('pagination').innerHTML = firstButton + prevButton + pageButtons.join('') + nextButton + lastPageButton;

  // 이벤트 리스너 추가
  document.querySelectorAll('#pagination .page-link').forEach(button => {
    button.addEventListener('click', (event) => {
      event.preventDefault();
      const action = event.target.closest('a').getAttribute('data-action');

      switch(action) {
        case 'first':
          page = 1;
          break;
        case 'prev':
          if (page - groupSize >= 1) {
            page -= groupSize;
          } else {
            page = 1;
          }
          break;
        case 'next':
          if (page + groupSize <= totalPage) {
            page += groupSize;
          } else {
            page = totalPage;
          }
          break;
        case 'last':
          page = totalPage;
          break;
        default:
          const clickedPage = parseInt(event.target.textContent);
          if (!isNaN(clickedPage)) {
            page = clickedPage;
          }
      }

      getRecipes(currentCategory); // 현재 선택된 카테고리로 데이터 요청
    });
  });
};

// 카테고리 버튼 클릭 시
document.querySelectorAll('.RecipeTypes button').forEach(button => {
  button.addEventListener('click', () => {
    // 현재 선택된 버튼에서 스타일 제거
    document.querySelectorAll('.RecipeTypes button').forEach(btn => {
      btn.style.backgroundColor = ''; // 기본 배경색
      btn.style.color = ''; // 기본 글자색
      btn.style.borderColor = ''; // 기본 테두리 색
    });

    // 클릭된 버튼에 스타일 적용
    button.style.backgroundColor = 'rgb(147, 112, 98)'; // 클릭된 버튼의 배경색
    button.style.color = '#fff'; // 클릭된 버튼의 글자색
    button.style.borderColor = 'rgb(147, 112, 98)'; // 클릭된 버튼의 테두리 색

    currentCategory = button.textContent.trim(); // 선택된 카테고리 저장
    page = 1; // 페이지를 1로 초기화
    getRecipes(currentCategory); // 선택된 카테고리로 데이터 요청
  });
});

// 초기 데이터 로드
getRecipes(currentCategory);

// 오류 메시지를 화면에 출력하는 함수
const displayErrorMessage = message => {
  const errorMessageHTML = `
    <div class="error-message">
        <p>${message}</p>
    </div>
  `;
  document.getElementById('recipe-board').innerHTML = errorMessageHTML;
};
