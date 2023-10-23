const search = document.getElementById("search");
const submit = document.getElementById("submit");
const random = document.getElementById("random");
const mealsEl = document.getElementById("meals");
const resultHeading = document.getElementById("result-heading");
const single_mealEl = document.getElementById("single-meal");
const random_mealEl = document.getElementById("random-meal");

// Search meal and fetch from API
function searchMeal(e) {
   e.preventDefault();

   // Clear single meal
   single_mealEl.innerHTML = "";
   random_mealEl.innerHTML = "";

   //search term
   const term = search.value;

   // Check for empty
   if (term.trim()) {
      fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
         .then((res) => res.json())
         .then((data) => {
            console.log(data);
            resultHeading.innerHTML = `<h2>Search results for '${term}':</h2>`;

            if (data.meals === null) {
               mealsEl.innerHTML = "";
               resultHeading.innerHTML = `<h2>There are no search results. Try again!<h2>`;
            } else {
               mealsEl.innerHTML = data.meals
                  .map(
                     (meal) => `
            <div class="meal">
              <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
              <div class="meal-info" data-mealID="${meal.idMeal}">
                <h3>${meal.strMeal}</h3>
              </div>
            </div>
          `
                  )
                  .join("");
            }
         });
      search.value = "";
   } else {
      alert("Please enter a search term");
   }
}

// Fetch meal by ID
function getMealById(mealID) {
   fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
      .then((res) => res.json())
      .then((data) => {
         addMeal(data.meals[0]);
      });
}

// Fetch random meal from API
function getRandomMeal(e) {
   e.preventDefault();
   // Clear meals and heading
   mealsEl.innerHTML = "";
   resultHeading.innerHTML = "";

   fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
      .then((res) => res.json())
      .then((data) => {
         addMeal(data.meals[0], true);
      });
}

// Add meal to DOM
const addMeal = (meal, isRandom) => {
   const ingredients = [];

   for (let i = 1; i <= 20; i++) {
      if (meal[`strIngredient${i}`]) {
         ingredients.push(
            `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`
         );
      } else {
         break;
      }
   }

   if (isRandom) {
      //RANDOM meal--------
      random_mealEl.innerHTML = `<div class="random-meal">
      <h1>${meal.strMeal}</h1>
      
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
      ${meal.strCategory ? `<h3>${meal.strCategory}</h3>` : ""}
      ${meal.strArea ? `<h3>${meal.strArea}</h3>` : ""}
      
          <p class="instruction">${meal.strInstructions}</p>
        <h2>Ingredients</h2>
        <ul>
          ${ingredients.map((ing) => `<li>${ing}</li>`).join("")}
        </ul>
      </div>`;
   } else {
      //SINGLE meal---------
      single_mealEl.innerHTML = `
        <div class="single-meal">
           <div class="single-meal-image">
              <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
              <h2>Ingredients</h2>
               
                   <ul>
                    ${ingredients.map((ing) => `<li>${ing}</li>`).join("")}
                   </ul>
               </div>
           <div class="single-meal-info">
              <span class="btn-close" onclick="onCloseClick()"></span>
              <h1>${meal.strMeal}</h1>
              ${meal.strCategory ? `<h3>${meal.strCategory}</h3>` : ""}
              ${meal.strArea ? `<h3>${meal.strArea}</h3>` : ""}
               <p class="instruction">${meal.strInstructions}</p>
            </div> 
        </div>`;
   }
};

// Event listeners
submit.addEventListener("submit", searchMeal);
random.addEventListener("click", getRandomMeal);

mealsEl.addEventListener("click", (e) => {
   const mealInfo = e.target.parentElement.querySelector(".meal-info");

   if (mealInfo) {
      const mealID = mealInfo.getAttribute("data-mealid");
      single_mealEl.style.display = "block";
      getMealById(mealID);
   }
});

const onCloseClick = () => {
   single_mealEl.innerHTML = "";
   single_mealEl.style.display = "none";
};
