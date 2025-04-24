import * as defaultFetch from "./defaultFetch.js";
import * as searchFetch from "./searchFetch.js";
import { displayGreeting } from "./greeting.js";

function initializeApp() {
  if (!localStorage.getItem("loggedInUser")) {
    // Redirect to login page if user is not logged in
    window.location.href = "log_in.html";
  }

  // Display greeting message
  displayGreeting();

  // Fetch weather data by default
  defaultFetch.fetchCityByDefault();

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

initializeApp();
