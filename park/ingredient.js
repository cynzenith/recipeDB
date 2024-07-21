const API_KEY = `7109179c29414b97985b`;
const serviceId = 'COOKRCP01';
const dataType = 'json';
let startIdx = '1';
let endIdx = '6';

let recipes = [];
let selectedIngredients = [];

let totalResults = 0;

// 전체 레시피 url
let url_object = new URL(
  `https://charming-cactus-400740.netlify.app/api/${API_KEY}/${serviceId}/${dataType}/${startIdx}/${endIdx}/RCP_PAT2=밥`
);

const RecipeTypes = document.querySelectorAll('.RecipeTypes button'); // console.log(RecipeTypes)
const Ingredients = document.querySelectorAll('.ingredient-bar button'); // console.log(ingredients)

RecipeTypes.forEach(RecipeType =>
  RecipeType.addEventListener('click', event => getRecipeByRecipeType(event))
);


// 카테고리 검색(1) : 요리 종류 ['반찬', '국&찌개', '후식', '일품', '밥', '기타']
const getRecipeByRecipeType = async event => {
  const RecipeType = event.target.textContent;
  const encodedRecipeType = RecipeType.toString();
  console.log(RecipeType);
  url_object = new URL(
    `https://charming-cactus-400740.netlify.app/api/${API_KEY}/${serviceId}/${dataType}/${startIdx}/${endIdx}/RCP_PAT2=${encodedRecipeType}`
  );
  await getRecipes();
};

function handleKeyDown(event) {
  if (event.key === 'Enter') {
    event.preventDefault(); // 폼 제출을 방지합니다.
    getRecipeByKeyword();
  }
}

// url를 바탕으로 레시피 데이터를 가져오는 함수
const getRecipes = async () => {
  try {
    const response = await fetch(url_object); // API 호출
    const data = await response.json(); // JSON 데이터 파싱

    totalResults = data.COOKRCP01.total_count; // 총 레시피 수
    console.log('total_count 결과 : ', totalResults);

    recipes = data.COOKRCP01.row; // 레시피 데이터 저장
    console.log('recipes 결과', recipes);

    render(); // 화면에 레시피 데이터 렌더링

  } catch (error) {
    console.error('Error fetching recipes:', error); // 오류 콘솔 출력
    displayErrorMessage(error.message); // 오류 메시지를 화면에 출력
  }
};

// 레시피 데이터를 바탕으로 HTML를 작성하여 화면에 출력하는 함수
const render = () => {
  if (!recipes || recipes.length === 0) {
    // recipes가 정의되지 않았거나 빈 배열일 경우
    displayErrorMessage('해당 레시피는 존재하지 않습니다.'); // 오류 메시지 출력
    return;
  }

  // recipes 배열에 있는 요소를 반복하여 recipeHTML에 대입
  const recipeHTML = recipes.map(item => {
    let manualStepsHTML = '';
    let stepCounter = 1;

    // 윤승근 수정 - Step 1 2 3
    for (let i = 1; i <= 20; i++) {
      let number = i < 10 ? '0' + i : i;
      let manualNum = item['MANUAL' + number];
      const manualField = `MANUAL${i.toString().padStart(2, '0')}`;
      if (manualNum && manualNum.trim() !== '') {
        manualNum = manualNum.replace(/^\d+/, stepCounter);
        manualStepsHTML += `<p><strong>Step ${manualNum}</strong></p>`;
        stepCounter++;
      }
    }
    // 윤승근 수정 (제외)
    // <div>${item.RCP_PAT2}</div>
    // <div>${item.RCP_WAY2}</div>

    // RCP_PARTS_DTLS에서 ●를 제거하고 싶은 부분
    const partsDetails = item.RCP_PARTS_DTLS.replace(/●/g, '');

    // 레시피 카드 HTML 생성
    return `
<div class="row recipe">
    <div class="col-lg-4 col-md-6 recipe-img">
      <div class="recipe-img-div">
        <img class="img-size img-fluid img-shadow" src="${item.ATT_FILE_NO_MAIN}" alt="" />
      </div>
    </div>
    <div class="col-lg-8 col-md-6">
        <h2 class="recipe-title">${item.RCP_NM}</h2>
        <div class="mb-3 recipe-details">${item.RCP_PARTS_DTLS.replace(/●/g, '')}</div>
        <div class="recipe-manual">${manualStepsHTML}</div>
    </div>
</div>

        `;
  });

  // 레시피 보드에 HTML 삽입
  document.getElementById('recipe-board').innerHTML = recipeHTML.join('');
};

// 오류 메시지를 화면에 출력하는 함수
const displayErrorMessage = message => {
  const errorMessageHTML = `
        <div class="error-message">
            <p>${message}</p>
        </div>
    `;
  document.getElementById('recipe-board').innerHTML = errorMessageHTML;
};

const openSearchBox = () => {
  let inputArea = document.getElementById('input-area');
  if (inputArea.style.display === 'inline') {
    inputArea.style.display = 'none';
  } else {
    inputArea.style.display = 'inline';
  }
};

getRecipes();
// getRecipesName()
