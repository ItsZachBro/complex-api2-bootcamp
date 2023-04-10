// Initialize the map
function initMap() {
  const map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 39.9526, lng: -75.1652 }, // Philly cuz pretzels
    zoom: 14,
  });

  // Add markers for nearby bars and restaurants
  const request = {
    location: map.getCenter(),
    radius: 5000,
    type: ["bar", "restaurant"],
  };

  const service = new google.maps.places.PlacesService(map);
  service.nearbySearch(request, (results, status) => {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      for (let i = 0; i < results.length; i++) {
        const place = results[i];
        createMarker(place);
      }
    }
  });

  // Create markers on the map
  function createMarker(place) {
    const marker = new google.maps.Marker({
      position: place.geometry.location,
      map: map,
    });

    google.maps.event.addListener(marker, "click", () => {
      fetchCocktails(place.name);
    });
  }
}

// Fetch cocktail recipes
async function fetchCocktails(barName) {
  const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${barName}`);
  const data = await response.json();
  displayCocktails(data.drinks);
}

// Display cocktail recipes
function displayCocktails(cocktails) {
  const cocktailsDiv = document.getElementById("cocktails");
  cocktailsDiv.innerHTML = "";

  if (cocktails) {
    cocktails.forEach((cocktail) => {
      const cocktailDiv = document.createElement("div");
      cocktailDiv.innerHTML = `
        <h3>${cocktail.strDrink}</h3>
        <img src="${cocktail.strDrinkThumb}" alt="${cocktail.strDrink}" width="100">
        <p><strong>Instructions:</strong> ${cocktail.strInstructions}</p>
        <p><strong>Ingredients:</strong> ${getIngredients(cocktail)}</p>
      `;
      cocktailsDiv.appendChild(cocktailDiv);
    });
  } else {
    cocktailsDiv.innerHTML = "<p>No cocktails found for this bar.</p>";
  }
}

// Get ingredients for a cocktail
function getIngredients(cocktail) {
  const ingredients = [];

  for (let i = 1; i <= 15; i++) {
    const ingredient = cocktail[`strIngredient${i}`];
    const measure = cocktail[`strMeasure${i}`];

    if (ingredient && measure) {
      ingredients.push(`${measure.trim()} ${ingredient.trim()}`);
    } else if (ingredient) {
      ingredients.push(ingredient.trim());
    }
  }

  return ingredients.join(", ");
}

// Call the initMap function
initMap();
