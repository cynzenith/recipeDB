document.getElementById('searchForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const recipeName = document.getElementById('recipeName').value;
    getRecipes(recipeName);
});

const getRecipes = async (recipeName) => {
    const apiKey = '7109179c29414b97985b';
    const serviceId = 'COOKRCP01';
    const dataType = 'json';
    const startIdx = '1';
    const endIdx = '10'; // 예시로 10개의 레시피를 가져옵니다.
    const url = `https://openapi.foodsafetykorea.go.kr/api/${apiKey}/${serviceId}/${dataType}/${startIdx}/${endIdx}/RCP_NM=${recipeName}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        // 각 요청 인자를 화면에 출력
        const resultsDiv = document.getElementById('results');
        resultsDiv.innerHTML = ''; // 기존 내용을 지웁니다.

        if (data.COOKRCP01 && data.COOKRCP01.row) {
            data.COOKRCP01.row.forEach(recipe => {
                const recipeDiv = document.createElement('div');
                recipeDiv.classList.add('recipe');

                const title = document.createElement('h2');
                title.textContent = `레시피 이름: ${recipe.RCP_NM}`;
                recipeDiv.appendChild(title);

                const ingredients = document.createElement('p');
                ingredients.textContent = `재료 및 세부 사항: ${recipe.RCP_PARTS_DTLS}`;
                recipeDiv.appendChild(ingredients);

                const method = document.createElement('p');
                method.textContent = `조리 방법: ${recipe.RCP_WAY2}`;
                recipeDiv.appendChild(method);

                const category = document.createElement('p');
                category.textContent = `요리 유형: ${recipe.RCP_PAT2}`;
                recipeDiv.appendChild(category);

                const hashTag = document.createElement('p');
                hashTag.textContent = `관련 해시태그: ${recipe.HASH_TAG}`;
                recipeDiv.appendChild(hashTag);

                const sequence = document.createElement('p');
                sequence.textContent = `레시피 순서 번호: ${recipe.RCP_SEQ}`;
                recipeDiv.appendChild(sequence);

                const tip = document.createElement('p');
                tip.textContent = `레시피 팁: ${recipe.RCP_NA_TIP}`;
                recipeDiv.appendChild(tip);

                const calories = document.createElement('p');
                calories.textContent = `칼로리: ${recipe.INFO_ENG}`;
                recipeDiv.appendChild(calories);

                const carbs = document.createElement('p');
                carbs.textContent = `탄수화물: ${recipe.INFO_CAR}`;
                recipeDiv.appendChild(carbs);

                const protein = document.createElement('p');
                protein.textContent = `단백질: ${recipe.INFO_PRO}`;
                recipeDiv.appendChild(protein);

                const fat = document.createElement('p');
                fat.textContent = `지방: ${recipe.INFO_FAT}`;
                recipeDiv.appendChild(fat);

                const sodium = document.createElement('p');
                sodium.textContent = `나트륨: ${recipe.INFO_NA}`;
                recipeDiv.appendChild(sodium);

                const weight = document.createElement('p');
                weight.textContent = `무게: ${recipe.INFO_WGT}`;
                recipeDiv.appendChild(weight);

                // 단계별 조리 방법 및 이미지
                for (let i = 1; i <= 20; i++) {
                    const step = recipe[`MANUAL${i.toString().padStart(2, '0')}`];
                    if (step) {
                        const stepElement = document.createElement('p');
                        stepElement.textContent = `단계 ${i}: ${step.replace(`${i}.`, '')}`;
                        recipeDiv.appendChild(stepElement);
                        
                        // 단계별 이미지
                        const stepImage = recipe[`MANUAL_IMG${i.toString().padStart(2, '0')}`];
                        if (stepImage) {
                            const imgLabel = document.createElement('p');
                            imgLabel.textContent = ``;
                            const imgElement = document.createElement('img');
                            imgElement.src = stepImage;
                            imgElement.alt = `단계 이미지 ${i}`;
                            imgElement.style.width = '100px'; // 이미지 크기 조절
                            recipeDiv.appendChild(imgLabel);
                            recipeDiv.appendChild(imgElement);
                        }
                    }
                }

                // 메인 요리 이미지
                if (recipe.ATT_FILE_NO_MAIN) {
                    const mainImageLabel = document.createElement('p');
                    mainImageLabel.textContent = '메인 요리 이미지:';
                    const mainImage = document.createElement('img');
                    mainImage.src = recipe.ATT_FILE_NO_MAIN;
                    mainImage.alt = '메인 요리 이미지';
                    mainImage.style.width = '200px'; // 이미지 크기 조절
                    recipeDiv.appendChild(mainImageLabel);
                    recipeDiv.appendChild(mainImage);
                }

                resultsDiv.appendChild(recipeDiv);
            });
        } else {
            resultsDiv.textContent = '레시피를 찾을 수 없습니다.';
        }
    } catch (error) {
        console.error('Error fetching the recipes:', error);
    }
};
