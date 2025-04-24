

import { fetchWeatherByCityAndCountry } from './searchFetch.js'; // Adjust path as needed
/*
function that takes city as input (from search input and from dropdown list)and
update search history which contains only 5 cities act as queue FirstInFirstOut (FIFO)
then saves it into local storage
*/
// At the top of your searchHistory.js file
export function updateSearchHistory(cityAndCountry) {
    const username = localStorage.getItem("loggedInUser");
    if (!username) return;

    // Get existing user data

    const userData = JSON.parse(localStorage.getItem(`userData_${username}`)) || {
        username: username,
        searchHistory: [],
        lastCity: ""
    };

    userData.lastCity = cityAndCountry;

    // Update search history (max 5 items, no duplicates)
    userData.searchHistory = [
        cityAndCountry,
        ...userData.searchHistory.filter(item => item !== cityAndCountry)
    ].slice(0, 5);

    // Save to localStorage
    localStorage.setItem(`userData_${username}`, JSON.stringify(userData));
}

export function getSearchHistory() {
    const username = localStorage.getItem("loggedInUser");
    if (!username) return [];

    const userData = JSON.parse(localStorage.getItem(`userData_${username}`)) || {
        searchHistory: [],
        lastCity: ""
    };
    return userData.searchHistory;
}

export function getLastCity() {

    const username = localStorage.getItem("loggedInUser");
    console.log(username);
    if (!username) return [];

    const userData = JSON.parse(localStorage.getItem(`userData_${username}`)) || {
        searchHistory: [],
        lastCity: ""
    };
    console.log("last city ", userData);

    return userData.lastCity;
}

export function displaySearchHistory() {
    const history = getSearchHistory();
    const historyContainer = document.querySelector('.historyOfSearch');

    if (!historyContainer) {
        console.error("History container not found");
        return;
    }

    // Clear existing items but keep the header
    historyContainer.innerHTML = '<li class="history-header">Recent Searches</li>';

    if (history.length === 0) {
        historyContainer.innerHTML += '<li class="history-empty">No recent searches</li>';
    } else {

        history.forEach(city => {
            const li = document.createElement('li');
            li.className = 'history-item';
            li.textContent = city.split(',')[0];

            li.addEventListener('click', async () => {
                try {
                    const unit = document.getElementById("degreeToggle")?.checked ? "imperial" : "metric";

                    // Update the search history first
                    updateSearchHistory(city);

                    // Fetch weather data
                    await fetchWeatherByCityAndCountry(city, unit);

                    // Refresh the history display to show the updated order
                    displaySearchHistory();

                } catch (error) {
                    console.error("Failed to fetch weather:", error);
                    alert("Failed to load weather data. Please try again.");
                }
            });

            historyContainer.appendChild(li);
        });
    }
}






