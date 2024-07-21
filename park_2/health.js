const API_KEY = "62fc00364bd146588740";
const originAddress = `https://charming-cactus-400740.netlify.app/api/${API_KEY}/COOKRCP01/json`;
const firstItem = 1;
const lastItem = 12;

// 레시피 데이터를 담을 객체
const recipes = {
    tomato: [],
    potato: [],
    sweetPotato: []
};

// URL 생성 함수
const createUrl = (ingredient) => {
    const encodedIngredient = encodeURIComponent(ingredient); // 인코딩 추가
    return new URL(`${originAddress}/${firstItem}/${lastItem}/RCP_NM=${encodedIngredient}`);
};

// url를 바탕으로 레시피 데이터를 가져오는 함수
const getRecipe = async (ingredient, type) => {
    try {
        const url = createUrl(ingredient);
        console.log(`Fetching URL: ${url}`); // URL 확인
        const response = await fetch(url); // API 호출

        if (response.ok) {
            const data = await response.json(); // JSON 데이터 파싱
            recipes[type] = data.COOKRCP01.row;
            render(type); // 해당 재료의 레시피 데이터 렌더링
            document.getElementById(`img-${type}`).parentElement.style.display = 'block'; // 섹션 표시
        } else {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
    } catch (error) {
        console.error(`Error fetching ${ingredient} recipes:`, error);
        displayErrorMessage(error.message, type);
    }
}

// 레시피 데이터를 바탕으로 HTML을 작성하여 화면에 출력하는 함수
const render = (type) => {
    const containerId = `img-${type}`;
    const arrRecipe = recipes[type];

    if (!arrRecipe || arrRecipe.length === 0) {
        displayErrorMessage("해당 레시피가 존재하지 않습니다.", type);
        return;
    }

    const recipeHTML = arrRecipe.map((item, index) => {
        return `
            <div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
                <div class="card" data-bs-toggle="modal" data-bs-target="#recipeModal" onclick="showModal(${index}, '${type}')">
                    <img src="${item.ATT_FILE_NO_MAIN}" class="card-img-top" alt="사진 설명">
                    <div class="card-body">
                        <p class="card-text">${item.RCP_NM}</p>
                        <span class="tooltip-text">${item.RCP_NM}</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    document.getElementById(containerId).innerHTML = recipeHTML;
}

// 모달 창에 데이터를 보여주는 함수
const showModal = (index, type) => {
    const recipe = recipes[type][index];

    // 레시피 조리 단계를 처리
    const manualSteps = [];
    for (let i = 1; i <= 20; i++) {
        if (recipe[`MANUAL${i.toString().padStart(2, '0')}`]) {
            manualSteps.push(recipe[`MANUAL${i.toString().padStart(2, '0')}`]);
        } else {
            break;
        }
    }
    const manualStepsHTML = manualSteps.map(step => `<p>${step}</p>`).join('');

    // 모달에 데이터 채우기
    document.getElementById('modal-img').src = recipe.ATT_FILE_NO_MAIN;
    document.getElementById('modal-title').innerText = recipe.RCP_NM;
    document.getElementById('modal-details').innerText = recipe.RCP_PARTS_DTLS.replace(/●/g, '');
    document.getElementById('modal-manual').innerHTML = manualStepsHTML;
}

// 오류 메시지를 화면에 출력하는 함수
const displayErrorMessage = (message, type) => {
    const containerId = `img-${type}`;
    const errorMessageHTML = `
        <div class="error-message">
            <p>Error: ${message}</p>
        </div>
    `;
    document.getElementById(containerId).innerHTML = errorMessageHTML;
}

// 순차적으로 레시피를 호출하는 함수
const fetchAllRecipes = async () => {
    await getRecipe("닭가슴살", "chickenBreast");
    await getRecipe("단호박", "sweetPumpkin");
    await getRecipe("두부", "beanCurd");
    await getRecipe("고구마", "sweetPotato");
    // await getRecipe("감자", "potato");
    // await getRecipe("토마토", "tomato");
}

// 페이지 로드 시 레시피를 순차적으로 호출
fetchAllRecipes();
