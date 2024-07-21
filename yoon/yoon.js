const API_KEY = '62fc00364bd146588740';
const serviceId = 'COOKRCP01';
const dataType = 'json';
let startIdx = 1;
let endIdx = 100;
let url = new URL(
  `https://openapi.foodsafetykorea.go.kr/api/${API_KEY}/${serviceId}/${dataType}/${startIdx}/${endIdx}`
);
let recipeList = [];
let filteredRecipes = []; // 전역 변수로 설정

// 메뉴 누르면 옆에 체크박스나옴
// 체크박스를 통해서 레시피 불러오기 (칼로리와 동일)
let menus = document.querySelectorAll('div.nutrition-box a');
menus.forEach(menu => menu.addEventListener('click', e => showCheckBox(e)));
let previousCategory = null;

function showCheckBox(e) {
  const currentCategory = e.currentTarget;
  console.log(currentCategory, currentCategory.textContent);

  if (previousCategory) {
    previousCategory.classList.remove('clicked');
  }
  // 칼로리, 지방, 나트륨, 단백질의 체크박스 none, flex
  currentCategory.classList.add('clicked');
  previousCategory = currentCategory;
  if (e.currentTarget.textContent === '칼로리') {
    const engCheckElements = document.querySelectorAll(
      '.eng-check div, .eng-check input'
    );
    const otherCheckElements = document.querySelectorAll(
      '.fat-check div, .fat-check input, .na-check div, .na-check input, .pro-check div, .pro-check input'
    );

    engCheckElements.forEach(element => {
      element.style.display =
        element.style.display === 'none' || element.style.display === ''
          ? 'flex'
          : 'none';
    });

    otherCheckElements.forEach(element => {
      element.style.display = 'none';
    });
  } else if (e.currentTarget.textContent === '지방') {
    const fatCheckElements = document.querySelectorAll(
      '.fat-check div, .fat-check input'
    );
    const otherCheckElements = document.querySelectorAll(
      '.eng-check div, .eng-check input, .na-check div, .na-check input, .pro-check div, .pro-check input'
    );

    fatCheckElements.forEach(element => {
      element.style.display =
        element.style.display === 'none' || element.style.display === ''
          ? 'flex'
          : 'none';
    });

    otherCheckElements.forEach(element => {
      element.style.display = 'none';
    });
  } else if (e.currentTarget.textContent === '나트륨') {
    const naCheckElements = document.querySelectorAll(
      '.na-check div, .na-check input'
    );
    const otherCheckElements = document.querySelectorAll(
      '.eng-check div, .eng-check input, .fat-check div, .fat-check input, .pro-check div, .pro-check input'
    );

    naCheckElements.forEach(element => {
      element.style.display =
        element.style.display === 'none' || element.style.display === ''
          ? 'flex'
          : 'none';
    });

    otherCheckElements.forEach(element => {
      element.style.display = 'none';
    });
  } else if (e.currentTarget.textContent === '단백질') {
    const proCheckElements = document.querySelectorAll(
      '.pro-check div, .pro-check input'
    );
    const otherCheckElements = document.querySelectorAll(
      '.eng-check div, .eng-check input, .fat-check div, .fat-check input, .na-check div, .na-check input'
    );

    proCheckElements.forEach(element => {
      element.style.display =
        element.style.display === 'none' || element.style.display === ''
          ? 'flex'
          : 'none';
    });

    otherCheckElements.forEach(element => {
      element.style.display = 'none';
    });
  }
}

// 페이지네이션 설정
let totalResults = 0;
let page = 1;
const pageSize = 6;
const groupSize = 5;

// 레시피 불러오기 (error catch)
const getRecipes = async () => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log('data', data);
    if (response.status === 200) {
      if (data.COOKRCP01.row.length === 0) {
        throw new Error('No result for this');
      }
      recipeList = data.COOKRCP01.row;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    errorRender(error.message);
  }
};

// 기본 영양소 값 설정
const rangeMapping = {
  INFO_ENG: 50, // 칼로리
  INFO_FAT: 5, // 지방
  INFO_NA: 100, // 나트륨
  INFO_PRO: 5, // 단백질
};

const EngCheckboxes = document.querySelectorAll(
  'input[name="INFO_ENG"], input[name="INFO_FAT"], input[name="INFO_NA"], input[name="INFO_PRO"]'
);
// 카테고리 일단 전역변수
let category = null;

EngCheckboxes.forEach(checkbox => {
  checkbox.addEventListener('click', async function () {
    const isChecked = this.checked;
    page = 1;

    // 나머지 체크박스 확인, 체크 해제
    EngCheckboxes.forEach(box => {
      if (box !== this) {
        box.checked = false;
      }
    });

    const divText = this.nextElementSibling.textContent.trim();
    const numberOnly = parseInt(
      divText.replace(/[^0-9]/g, '').replace(/[a-zA-Z]{1,3}$/, '')
    );

    // 카테고리 추출
    category = this.name; // 전역 변수에 설정
    console.log(`Category extracted: ${category}`); // 확인용

    // 카테고리에 따라 범위 설정
    const range = rangeMapping[category] || 50; // 기본값 50으로 설정

    console.log(`${category}: ${numberOnly}`);

    try {
      const response = await fetch(url);
      const data = await response.json();
      console.log('data', data);

      recipeList = data.COOKRCP01.row;

      // 필터링된 레시피 리스트
      filteredRecipes = recipeList.filter(recipe => {
        // category 속성의 존재 여부 확인
        console.log('Recipe object:', recipe);
        const value = parseInt(recipe[category]);
        return (
          !isNaN(value) && value < numberOnly && value > numberOnly - range
        );
      });

      totalResults = filteredRecipes.length;
      console.log('filter', filteredRecipes);

      renderRecipes(filteredRecipes, category); // category 매개변수 전달
      paginationRender();
    } catch (error) {
      console.error('Error fetching data:', error);
      errorRender('데이터를 가져오는 도중 오류가 발생했습니다.');
    }
  });
});

// 레시피 모달 띄우기
const showDetail = index => {
  const showRecipe = filteredRecipes; // 필터링된, 현재 페이지에 있는거 적용

  let recipeOrderHTML = ``;
  let order = 1;
  for (let i = 1; i <= 20; i++) {
    let number = i < 10 ? '0' + i : i;
    const imgText = showRecipe[index]['MANUAL_IMG' + number];
    const text = showRecipe[index]['MANUAL' + number];
    if (imgText && text) {
      recipeOrderHTML += `<div class="d-flex align-items-start gap-3 m-3">
            <img src="${imgText}" alt="" width="170" />
            <p>${text.replace(/^\d+/, order++)}</p>
        </div>`;
    }
  }
  const detailHTML = `<div class="modal-header">
        <h1 class="modal-title fs-5" id="staticBackdropLabel">${showRecipe[index].RCP_NM}</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">      
            ${recipeOrderHTML}
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
      </div>`;
  document.querySelector('.modal-content').innerHTML = detailHTML;
};

function renderRecipes(recipes, category) {
  console.log('Category:', category);
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const recipesToShow = recipes.slice(start, end);
  const categoryLabel = {
    INFO_ENG: '칼로리',
    INFO_FAT: '지방',
    INFO_NA: '나트륨',
    INFO_PRO: '단백질',
  };
  const categoryUnit = {
    INFO_ENG: 'cal',
    INFO_FAT: 'g',
    INFO_NA: 'mg',
    INFO_PRO: 'g',
  };

  // 조리법에 1 붙이기
  const recipesHTML = recipesToShow
    .map((recipe, index) => {
      let manualHTML = '';
      let order = 1;
      for (let i = 1; i <= 20; i++) {
        let number = i < 10 ? '0' + i : i;
        let manualNum = recipe['MANUAL' + number];
        if (manualNum && manualNum.trim() !== '') {
          manualNum = manualNum.replace(/^\d+/, order);
          manualHTML += `<p>${manualNum}</p>`;
          order++;
        }
      }

      console.log('Recipe category value:', recipe[category]);

      return `
      <div class='recipe'>
        <h2><strong>${recipe.RCP_NM}</strong></h2>
        <img src="${
          recipe.ATT_FILE_NO_MAIN
        }" alt="Recipe Image" onClick="showDetail(${index})" data-bs-toggle="modal" data-bs-target="#recipeModal"/>
        <p><strong>${categoryLabel[category] || '정보 없음'}: ${Math.round(
        recipe[category] || 0
      )} ${categoryUnit[category] || ''}</strong></p>
        <p>${recipe.RCP_PARTS_DTLS}</p>

      </div>
    `;
    })
    .join('');

  document.getElementById('recipe-container').innerHTML = recipesHTML;
}
{
  /* <strong>${manualHTML}</strong> */
}

// function renderRecipes(recipes, category) {
//   console.log('Category:', category);
//   const start = (page - 1) * pageSize;
//   const end = start + pageSize;
//   const recipesToShow = recipes.slice(start, end);
//   const categoryLabel = {
//     INFO_ENG: '칼로리',
//     INFO_FAT: '지방',
//     INFO_NA: '나트륨',
//     INFO_PRO: '단백질',
//   };
//   const categoryUnit = {
//     INFO_ENG: 'cal',
//     INFO_FAT: 'g',
//     INFO_NA: 'mg',
//     INFO_PRO: 'g',
//   };

//   // 조리법에 1 붙이기
//   const recipesHTML = recipesToShow
//     .map(recipe => {
//       let manualHTML = '';
//       let order = 1;
//       for (let i = 1; i <= 20; i++) {
//         let number = i < 10 ? '0' + i : i;
//         let manualNum = recipe['MANUAL' + number];
//         if (manualNum && manualNum.trim() !== '') {
//           manualNum = manualNum.replace(/^\d+/, order);
//           manualHTML += `<p>${manualNum}</p>`;
//           order++;
//         }
//       }

//       console.log('Recipe category value:', recipe[category]);

//       return `
//       <div class='recipe'>
//         <h2><strong>${recipe.RCP_NM}</strong></h2>
//         <img src="${recipe.ATT_FILE_NO_MAIN}" alt="Recipe Image"/>
// <p><strong>${categoryLabel[category] || '정보 없음'}: ${Math.round(
//         recipe[category] || 0
//       )} ${categoryUnit[category] || ''}</strong></p>
//         <p>${recipe.RCP_PARTS_DTLS}</p>
//         <strong>${manualHTML}</strong>
//       </div>
//     `;
//     })
//     .join('');

//   document.getElementById('recipe-container').innerHTML = recipesHTML;
// }

// function errorRender(message) {
//   document.getElementById(
//     'recipe-container'
//   ).innerHTML = `<p>Error: ${message}</p>`;
// }

function errorRender(message) {
  document.getElementById(
    'recipe-container'
  ).innerHTML = `<p>Error: ${message}</p>`;
}

//페이지 표시
const paginationRender = () => {
  const totalPages = Math.ceil(totalResults / pageSize);
  const pageGroup = Math.ceil(page / groupSize);
  let lastPage = pageGroup * groupSize;
  if (lastPage > totalPages) {
    lastPage = totalPages;
  }
  const firstPage =
    lastPage - (groupSize - 1) <= 0 ? 1 : lastPage - (groupSize - 1);

  let paginationHTML = ``;
  if (page > 1 && totalPages > 2) {
    paginationHTML += `<li class="page-item"><a class="page-link" onClick="moveToPage(1)">&lt&lt</a></li>
    <li class="page-item"><a class="page-link" onClick="moveToPage(${
      page - 1
    })">&lt</a></li>`;
  } else if (totalPages > 1 && totalPages < 3) {
    paginationHTML += `<li class="page-item"><a class="page-link" onClick="moveToPage(${
      page - 1
    })">&lt</a></li>`;
  }

  for (let i = firstPage; i <= lastPage; i++) {
    paginationHTML += `<li class="page-item ${
      i === page ? 'active' : ''
    }" onClick="moveToPage(${i})"><a class="page-link">${i}</a></li>`;
  }
  if (page < totalPages && totalPages > 2) {
    paginationHTML += `<li class="page-item"><a class="page-link" onClick="moveToPage(${
      page + 1
    })">&gt</a></li>
        <li class="page-item"><a class="page-link" onClick="moveToPage(${totalPages})">&gt&gt</a></li>
    `;
  } else if (totalPages > 1 && totalPages < 3) {
    paginationHTML += `<li class="page-item"><a class="page-link" onClick="moveToPage(${
      page + 1
    })">&gt</a></li>`;
  }
  document.querySelector('.pagination').innerHTML = paginationHTML;
};

const moveToPage = pageNum => {
  console.log('move', pageNum);
  page = pageNum;
  if (category) {
    // category가 설정되어 있는지 확인
    renderRecipes(filteredRecipes, category);
    paginationRender();
  } else {
    console.error('Category is not defined');
    errorRender('카테고리가 정의되지 않았습니다.');
  }
};

getRecipes(); // 초기 레시피 불러오기
