// 전체 요리 종류을 콘솔에 출력합니다.
// ['반찬', '국&찌개', '후식', '일품', '밥', '기타']
const getRecipeTypes = async () => {
    await getRecipes();

    const recipeTypes = new Set(); // 요리 유형을 저장할 Set 생성
    recipes.forEach(recipe => {
        if (recipe.RCP_PAT2) {
            recipeTypes.add(recipe.RCP_PAT2);
        }
    });

    console.log("요리 유형 결과:", Array.from(recipeTypes));
};


// 전체 조리방법을 콘솔에 출력합니다.
// ['찌기', '기타', '끓이기', '굽기', '볶기', '튀기기']
const getCookingMethods = async () => {
    await getRecipes();

    const cookingMethods = new Set(); // 조리 방법을 저장할 Set 생성
    recipes.forEach(recipe => {
        if (recipe.RCP_WAY2) {
            cookingMethods.add(recipe.RCP_WAY2);
        }
    });

    console.log("조리 방법 결과:", Array.from(cookingMethods));
};


// 1개의 레시피의 재료의 이름만 추출하는 함수
const getRecipes = async() => {
    const response = await fetch(url_object)
    const data = await response.json()
    console.log("data 결과 : ", data)

    total_count = data.COOKRCP01.total_count
    console.log("total_count 결과 : ", total_count)

    recipes = data.COOKRCP01.row        // recipes 자주 변경될 요소이므로, 코드 상단에 전역변수로 선언한다.
    console.log("recipes 결과", recipes)

    // RCP_PARTS_DTLS 문자열에서 재료만 추출하여 배열에 저장
    const ingredientsString = data.COOKRCP01.row[0].RCP_PARTS_DTLS;
    const ingredientsArray = extractIngredients(ingredientsString);
    console.log("추출된 재료:", ingredientsArray);
}
//  음식 재료 문자열을 받아서 재료명만 추출하여 배열로 반환하는 함수
//  @param {string} ingredientsString - 재료 문자열 / @returns {Array<string>} - 재료명 배열
const extractIngredients = (ingredientsString) => {
    // 재료 문자열을 ','로 분리하여 배열로 변환
    const parts = ingredientsString.split(', ');
    // 각 재료 문자열에서 재료명만 추출하여 배열로 반환 (newline 문자가 없는 경우만)
    const ingredients = parts
        .filter(part => !part.includes('\n')) // '\n'이 포함된 재료는 제외
        .map(part => part.split(' ')[0]);
    return ingredients;
};



// 모든 레시피의 재료를 추출하고 중복을 제거하여 배열에 저장하는 함수
const getAllIngredients = async () => {
    await getRecipes();

    const allIngredients = new Set();
    recipes.forEach(recipe => {
        const ingredientsString = recipe.RCP_PARTS_DTLS;
        const ingredientsArray = extractIngredients(ingredientsString);
        ingredientsArray.forEach(ingredient => allIngredients.add(ingredient));
    });

    console.log("추출된 재료:", Array.from(allIngredients));
};

//  음식 재료 문자열을 받아서 재료명만 추출하여 배열로 반환하는 함수
//  @param {string} ingredientsString - 재료 문자열 / @returns {Array<string>} - 재료명 배열
const extractIngredients = (ingredientsString) => {
    // 재료 문자열을 ','로 분리하여 배열로 변환
    const parts = ingredientsString.split(', ');
    // 각 재료 문자열에서 재료명만 추출하여 배열로 반환 (newline 문자가 없는 경우만)
    const ingredients = parts
        .filter(part => !part.includes('\n')) // '\n'이 포함된 재료는 제외
        .map(part => part.split(' ')[0]);
    return ingredients;
};

// 모든 재료를 추출하는 함수 호출
getAllIngredients();



// 모든 레시피의 재료를 추출하고 빈도 수를 계산하여 상위 100개의 재료를 출력하는 함수
const getTopIngredients = async () => {
    await getRecipes();

    const ingredientCount = new Map();

    recipes.forEach(recipe => {
        const ingredientsString = recipe.RCP_PARTS_DTLS;
        const ingredientsArray = extractIngredients(ingredientsString);
        ingredientsArray.forEach(ingredient => {
            if (ingredientCount.has(ingredient)) {
                ingredientCount.set(ingredient, ingredientCount.get(ingredient) + 1);
            } else {
                ingredientCount.set(ingredient, 1);
            }
        });
    });

    // 빈도 수에 따라 정렬
    const sortedIngredients = Array.from(ingredientCount.entries()).sort((a, b) => b[1] - a[1]);

    // 상위 100개의 재료 출력
    console.log("상위 100개의 재료:");
    sortedIngredients.slice(0, 100).forEach((item, index) => {
        console.log(`${index + 1}등: ${item[0]} (${item[1]}회)`);
    });
};

//  음식 재료 문자열을 받아서 재료명만 추출하여 배열로 반환하는 함수
//  @param {string} ingredientsString - 재료 문자열 / @returns {Array<string>} - 재료명 배열
const extractIngredients = (ingredientsString) => {
    // 재료 문자열을 ','로 분리하여 배열로 변환
    const parts = ingredientsString.split(', ');
    // 각 재료 문자열에서 재료명만 추출하여 배열로 반환 (newline 문자가 없는 경우만)
    const ingredients = parts
        .filter(part => !part.includes('\n')) // '\n'이 포함된 재료는 제외
        .map(part => part.split(' ')[0]);
    return ingredients;
};

// 상위 100개의 재료를 추출하는 함수 호출
getTopIngredients();