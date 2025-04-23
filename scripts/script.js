import * as defaultFetch from "./defaultFetch.js";
import * as searchFetch from "./searchFetch.js";

let apiKey;
const baseUrl = "https://api.openweathermap.org/";
const weatherByCityEndPoint = baseUrl + "data/2.5/forecast";
const currentLocalSotrageValue = localStorage.getItem("currentCityAndCountry");
if (!currentLocalSotrageValue) {
  localStorage.setItem("currentCityAndCountry", "London,GB");
}

fetch("./api.json")
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    apiKey = data.API_KEY;
    initializeApp();
  })
  .catch((error) => {
    console.error("Error loading API key:", error);
    alert("Failed to load API configuration. Please try again later.");
  });

function initializeApp() {
  // Predefined Dropdown and Search Feature
  searchFetch.populateDropDown();
  searchFetch.populateDropDownOnClick();

  // Search bar feature
  searchFetch.searchByCityAndCountryKeypress();
  searchFetch.searchByCityAndCountryClick();

  // Weather Units Toggle Button Feature
  searchFetch.toggleWeatherMeasurement();

  // DarkMode Toggle Button Feature
  searchFetch.toggleDarkMode();
}
