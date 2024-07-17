const API_KEY = `7109179c29414b97985b`;
const serviceId = 'COOKRCP01';
const dataType = 'json';
let startIdx = '1';
let endIdx = '10';

let recipes = []

// 전체 레시피 url
let url_object = new URL(`https://charming-cactus-400740.netlify.app/api/${API_KEY}/${serviceId}/${dataType}/${startIdx}/${endIdx}/RCP_NM=가`);

const RecipeTypes = document.querySelectorAll('.RecipeTypes button'); // console.log(RecipeTypes)
const Ingredients = document.querySelectorAll('.Ingredients button'); // console.log(ingredients)

RecipeTypes.forEach(RecipeType=> RecipeType.addEventListener("click",(event)=>getRecipeByRecipeType(event)))
Ingredients.forEach(Ingredient=> Ingredient.addEventListener("click",(event)=>getRecipeByIngredient(event)))

// 카테고리 검색(1) : 요리 종류 ['반찬', '국&찌개', '후식', '일품', '밥', '기타']
const getRecipeByRecipeType = async(event) => {
    const RecipeType = event.target.textContent
    const encodedRecipeType = RecipeType.toString();
    console.log(RecipeType)
    url_object = new URL(`https://charming-cactus-400740.netlify.app/api/${API_KEY}/${serviceId}/${dataType}/${startIdx}/${endIdx}/RCP_PAT2=${encodedRecipeType}`);
    await getRecipes()
}

// 카테고리 검색(2) : 요리 재료 ['양파', '물', '설탕', '소금', '참기름', '식초', '당근', '마늘', '간장', '홍고추', '통깨', '후추']
const getRecipeByIngredient = async(event) => {
    const Ingredient = event.target.textContent
    console.log(Ingredient)
    url_object = new URL(`https://charming-cactus-400740.netlify.app/api/${API_KEY}/${serviceId}/${dataType}/${startIdx}/${endIdx}/RCP_PARTS_DTLS=${Ingredient}`);
    await getRecipes()
}

// [검색]을 통해 특정 메뉴의 레시피 데이터를 가져오는 함수
const getRecipeByKeyword = async() => {
    const recipeName = document.getElementById('search-input').value
    url_object = new URL(`https://charming-cactus-400740.netlify.app/api/${API_KEY}/${serviceId}/${dataType}/${startIdx}/${endIdx}/RCP_NM=${recipeName}`);
    await getRecipes()
}

// url를 바탕으로 레시피 데이터를 가져오는 함수
const getRecipes = async() => {
    const response = await fetch(url_object)
    const data = await response.json()
    // console.log("data 결과 : ", data)

    total_count = data.COOKRCP01.total_count
    console.log("total_count 결과 : ", total_count)

    recipes = data.COOKRCP01.row        // recipes 자주 변경될 요소이므로, 코드 상단에 전역변수로 선언한다.
    console.log("recipes 결과", recipes)

    render()
}

// 레시피 데이터를 바탕으로 HTML를 작성하여 화면에 출력하는 함수
const render = () => {
    // recipes 배열에 있는 요소를 반복하여 recipeHTML에 대입
    const recipeHTML = recipes.map(item => {
        let manualStepsHTML = '';
        let stepCounter = 1;

        // MANUAL01부터 MANUAL20까지의 단계별 조리 방법을 확인하고, 존재하는 단계만 추가
        for (let i = 1; i <= 20; i++) {
            const manualField = `MANUAL${i.toString().padStart(2, '0')}`;
            if (item.hasOwnProperty(manualField) && item[manualField].trim() !== '') {
                manualStepsHTML += `<p><strong>Step ${stepCounter}:</strong> ${item[manualField]}</p>`;
                stepCounter++;
            }
        }

        // 레시피 카드 HTML 생성
        return `
            <div class="row recipe">
                <div class="col-lg-4">
                    <img class="img-size" src="${item.ATT_FILE_NO_MAIN}" alt="" />
                </div>
                <div class="col-lg-8">
                    <h2>${item.RCP_NM}</h2>
                    <div>${item.RCP_PAT2}</div>
                    <div>${item.RCP_WAY2}</div>
                    <div>${item.RCP_PARTS_DTLS}</div>
                    <div>${manualStepsHTML}</div> <!-- 실제 존재하는 단계만 추가 -->
                </div>
            </div>
        `;
    });

    // 레시피 보드에 HTML 삽입
    document.getElementById('recipe-board').innerHTML = recipeHTML.join('');
};



const openSearchBox = () => {
    let inputArea = document.getElementById("input-area");
    if (inputArea.style.display === "inline") {
        inputArea.style.display = "none";
    } else {
        inputArea.style.display = "inline";
    }
};

function handleKeyDown(event) {
    if (event.key === "Enter") {
        getRecipeByKeyword();
    }
}

getRecipes()
// getRecipesName()



