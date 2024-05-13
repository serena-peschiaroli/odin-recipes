
document.addEventListener('DOMContentLoaded', function() {
    // base URL for fetching data from TheMealDB API
    const baseUrl = 'https://www.themealdb.com/api/json/v1/1/search.php?f=';

    //event listeners to navigation links for fetching data
    document.getElementById('recipes-a').addEventListener('click', (e) => fetchData(e, 'a'));
    document.getElementById('recipes-b').addEventListener('click', (e) => fetchData(e, 'b'));
    document.getElementById('recipes-c').addEventListener('click', (e) => fetchData(e, 'c'));

    // variables for pagination setup
    let currentPage = 1;
    const itemsPerPage = 2;

    // function to fetch data 
    function fetchData(event, letter) {
        event.preventDefault(); 

        //api fetch
        fetch(baseUrl + letter) 
            .then(response => {
                if (!response.ok) { 
                    //throw error if not successfull
                    throw new Error('Network response was not ok');
                    //parse json
                }
                return response.json(); 
            })
            .then(data => {
                //log for debug
                console.log(data); 
                //store meals in global variable
                currentMeals = data.meals; 
                //display recipi in UI
                displayRecipes(data.meals); 
            })
            // log errors if fetch fails
            .catch(error => console.error('error in fetch data: ' + error)); 
    }

    // function to display recipes in the UI
    function displayRecipes(meals) {
        //container for recipes
        const container = document.querySelector('.row');
        // clear previous content 
        container.innerHTML = ''; 

        // calculate start and end index for pagiation
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        //items for current page
        const paginatedItems = meals.slice(start, end); 

        if (paginatedItems.length > 0) {
            // iteration over each meal to create card 
            paginatedItems.forEach(meal => { 
                const col = document.createElement('div');
                col.className = 'col';
                const card = document.createElement('div');
                card.className = 'card';
                card.innerHTML = `
                <h3 class="card-title">${meal.strMeal}</h3>
                    <img src="${meal.strMealThumb}" alt="${meal.strMeal}" style="width:100%;">
                    <p class="card-body">${meal.strInstructions.substring(0, 200)}...</p>
                    <h3 class="ingredients">First three ingredients: </h3>
                    <ul>
                        <li>${meal.strIngredient1}</li>
                        <li>${meal.strIngredient2}</li>
                        <li>${meal.strIngredient3}</li>
                    </ul>
                `;
                col.appendChild(card); 
                container.appendChild(col);
            });
        } else {
            container.innerHTML = '<p>No result found</p>'; 
        }

        //display pagination controls
        displayPaginationControls(meals.length);
    }


    function displayPaginationControls(totalItems) {
        //container pagination control
        const paginationContainer = document.getElementById('pagination');
        //clear content
        paginationContainer.innerHTML = '';

        //calculate the total num of pages
        const pageCount = Math.ceil(totalItems / itemsPerPage);
        //button for each page
        for (let i = 1; i <= pageCount; i++) { 
            const pageButton = document.createElement('button');
            pageButton.textContent = i;
            //click handler for each btn
            pageButton.onclick = function() { 
                //update current page
                currentPage = i; 
                //display recipes for new page
                displayRecipes(currentMeals); 
            };

            if (currentPage === i) {
                //add class to current page btn 
                pageButton.classList.add('active'); 
            }

            paginationContainer.appendChild(pageButton); 
        }
    }
});
