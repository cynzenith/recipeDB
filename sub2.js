const API_KEY = `7109179c29414b97985b`;
const serviceId = 'COOKRCP01';
const dataType = 'json';
let startIdx = '1';
let endIdx = '20';

let recipes = []

// 전체 레시피 url
let url_object = new URL(`https://charming-cactus-400740.netlify.app/api/${API_KEY}/${serviceId}/${dataType}/${startIdx}/${endIdx}`);

// 전체 레시피 데이터를 가져오는 함수
const getRecipes = async() => {
    const response = await fetch(url_object)
    const data = await response.json()
    console.log("data 결과 : ", data)

    total_count = data.COOKRCP01.total_count
    console.log("total_count 결과 : ", total_count)

    recipes = data.COOKRCP01.row        // recipes 자주 변경될 요소이므로, 코드 상단에 전역변수로 선언한다.
    console.log("recipes 결과", recipes)

    render()
}


// 특정 레시피 데이터를 가져오는 함수
let recipeName = '된장국'
const getRecipesName = async() => {
    url_object = new URL(`https://charming-cactus-400740.netlify.app/api/${API_KEY}/${serviceId}/${dataType}/${startIdx}/${endIdx}/RCP_NM=${recipeName}`);
    await getRecipes()
}

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
                    <div>${item.RCP_PARTS_DTLS}</div>
                    <div>${manualStepsHTML}</div> <!-- 실제 존재하는 단계만 추가 -->
                </div>
            </div>
        `;
    });

    // 레시피 보드에 HTML 삽입
    document.getElementById('recipe-board').innerHTML = recipeHTML.join('');
};




getRecipes()
// getRecipesName()



