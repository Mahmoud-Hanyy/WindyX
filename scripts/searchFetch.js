const response = await fetch("./api.json");
const data = await response.json();
const apiKey = data.API_KEY;
const baseUrl = "https://api.openweathermap.org/";
const weatherByCityEndPoint = baseUrl + "data/2.5/forecast";

const predefinedCities = [
  { city: "New York", country: "US" },
  { city: "Los Angeles", country: "US" },
  { city: "Chicago", country: "US" },
  { city: "London", country: "GB" },
  { city: "Paris", country: "FR" },
  { city: "Berlin", country: "DE" },
  { city: "Madrid", country: "ES" },
  { city: "Rome", country: "IT" },
  { city: "Amsterdam", country: "NL" },
  { city: "Moscow", country: "RU" },
  { city: "Beijing", country: "CN" },
  { city: "Shanghai", country: "CN" },
  { city: "Tokyo", country: "JP" },
  { city: "Seoul", country: "KR" },
  { city: "Bangkok", country: "TH" },
  { city: "Jakarta", country: "ID" },
  { city: "Mumbai", country: "IN" },
  { city: "New Delhi", country: "IN" },
  { city: "Dubai", country: "AE" },
  { city: "Riyadh", country: "SA" },
  { city: "Istanbul", country: "TR" },
  { city: "Cairo", country: "EG" },
  { city: "Johannesburg", country: "ZA" },
  { city: "Sydney", country: "AU" },
  { city: "Melbourne", country: "AU" },
  { city: "São Paulo", country: "BR" },
  { city: "Buenos Aires", country: "AR" },
  { city: "Mexico City", country: "MX" },
  { city: "Toronto", country: "CA" },
  { city: "Vancouver", country: "CA" },
];

export function populateDropDown() {
  const dropMenu = document.querySelector(".dropMenu");
  predefinedCities.forEach((city) => {
    const option = document.createElement("option");
    option.value = `${city.city},${city.country}`;
    option.textContent = `${city.city}, ${city.country}`;
    dropMenu.appendChild(option);
  });
}

export function populateDropDownOnClick() {
  const dropMenu = document.querySelector(".dropMenu");
  dropMenu.addEventListener("change", () => {
    const selectedCity = dropMenu.value;
    const unit = document.getElementById("degreeToggle").checked
      ? "imperial"
      : "metric";
    fetchWeatherByCityAndCountry(selectedCity, unit);
  });
}

/**
 * @function searchByCityAndCountryKeypress
 */
export function searchByCityAndCountryKeypress() {
  const searchBar = document.getElementById("searchInput");
  searchBar.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      const cityAndCountry = document.getElementById("searchInput").value;
      const unit = document.getElementById("degreeToggle").checked
        ? "imperial"
        : "metric";

      fetchWeatherByCityAndCountry(cityAndCountry, unit);
      searchBar.value = "";

      const dropMenu = document.querySelector(".dropMenu");
      dropMenu.selectedIndex = 0;
    }
  });
}

/**
 * @function searchByCityAndCountryClick
 */
export function searchByCityAndCountryClick() {
  document.getElementById("searchIcon").addEventListener("click", () => {
    let cityAndCountry = document.getElementById("searchInput").value;
    let unit = document.getElementById("degreeToggle").checked
      ? "imperial"
      : "metric";
    if (cityAndCountry) {
      fetchWeatherByCityAndCountry(cityAndCountry, unit);
      const dropMenu = document.querySelector(".dropMenu");
      dropMenu.selectedIndex = 0;
    }
  });
}

export function toggleDarkMode() {
  document.getElementById("themeToggle").addEventListener("click", () => {
    document.querySelector(".weatherContainer").classList.toggle("darkMode");
    document.getElementById("day1").classList.toggle("darkCard");
    document.getElementById("day2").classList.toggle("darkCard");
    document.getElementById("day3").classList.toggle("darkCard");
    document
      .querySelector(".rightSection")
      .classList.toggle("darkRightSection");
    document.getElementById("searchInput").classList.toggle("lightSearchInput");
    document.querySelector(".dropMenu").classList.toggle("lightDropMenu");
    document.querySelector("hr").classList.toggle("lightHorizontalRule");
  });
}

/**
 * @function toggleWeatherMeasurement
 */
export function toggleWeatherMeasurement() {
  document.getElementById("degreeToggle").addEventListener("change", () => {
    const cityAndCountry = localStorage.getItem("currentCityAndCountry");
    const unit = document.getElementById("degreeToggle").checked
      ? "imperial"
      : "metric";

    fetchWeatherByCityAndCountry(cityAndCountry, unit);
  });
}

/**
 *
 * @param {string} days
 * @param {string} unit
 */
function displayDailyForecast(days, unit) {
  const forecastDays = days.slice(0, 3);

  forecastDays.forEach((day, index) => {
    const dayElement = document.getElementById(`day${index + 1}`);
    if (dayElement) {
      dayElement.children[0].textContent = day.date;
      dayElement.children[1].textContent = `${Math.round(day.temp)}${
        unit === "metric" ? "°C" : "°F"
      }`;
      dayElement.children[2].src = `https://openweathermap.org/img/wn/${day.icon}.png`;
      dayElement.children[2].alt = day.description;
    }
  });
}

/**
 *
 * @function getWeatherDetails
 *
 * @param {Array} currentWeatherData
 * @returns
 */
function getWeatherDetails(currentWeatherData) {
  const currentWindSpeed = currentWeatherData.wind.speed;
  const currentTemp = currentWeatherData.main.temp;
  const currentWeatherCondition = currentWeatherData.weather[0].main;
  const currentDescription = currentWeatherData.weather[0].description;
  const currentHumidity = currentWeatherData.main.humidity;
  const weatherDetailsObject = {
    currentTemp,
    currentDescription,
    currentWeatherCondition,
    currentHumidity,
    currentWindSpeed,
  };

  return weatherDetailsObject;
}

function getWeatherForecasts(currentWeatherList) {
  const dailyForecasts = {};
  for (const forecast of currentWeatherList) {
    const date = new Date(forecast.dt * 1000);
    const dateString = date.toLocaleDateString("en-US", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    if (!dailyForecasts[dateString]) {
      dailyForecasts[dateString] = [];
    }
    dailyForecasts[dateString].push(forecast);
  }
  return dailyForecasts;
}

/**
 *
 * @param {Object} currentWeatherList
 * @returns
 */
function cleanWeatherForecasts(currentWeatherList) {
  const dailyForecasts = getWeatherForecasts(currentWeatherList);
  const dayKeys = Object.keys(dailyForecasts).slice(0, 4);

  //   get the forecast with the highest temperature
  const processedDays = dayKeys.map((dayKey) => {
    const dayForecasts = dailyForecasts[dayKey];

    // Find the forecast with the highest temperature
    let maxTempForecast = dayForecasts.reduce((max, forecast) => {
      return forecast.main.temp > max.main.temp ? forecast : max;
    }, dayForecasts[0]);

    const date = new Date(maxTempForecast.dt * 1000);
    return {
      date: date.toLocaleDateString("en-US", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      temp: maxTempForecast.main.temp,
      icon: maxTempForecast.weather[0].icon,
      description: maxTempForecast.weather[0].description,
    };
  });

  return processedDays;
}

export async function fetchWeatherByCityAndCountry(
  cityAndCountry,
  unit = "metric"
) {
  try {
    const queryString = `?q=${cityAndCountry}&units=${unit}&appid=${apiKey}`;
    const url = weatherByCityEndPoint + `${queryString}`;
    const response = await fetch(url);
    console.log(cityAndCountry);
    console.log(url);
    if (!response.ok) {
      alert("Please enter city's name correctly");
      document.querySelector(".searchInput").value = "";
    }

    localStorage.setItem("currentCityAndCountry", cityAndCountry);
    const weatherData = await response.json();
    const currentWeatherList = weatherData.list;
    const currentWeatherData = currentWeatherList[0];
    const weatherDetailsObject = getWeatherDetails(currentWeatherData);
    const processedDays = cleanWeatherForecasts(currentWeatherList);
    console.log(processedDays);
    console.log(weatherDetailsObject);

    const icon = processedDays[0].icon;
    const firstDay = processedDays[0];
    let dateTime = firstDay.date;
    displayDailyForecast(processedDays.slice(1), unit);
    displayCurrentWeather(weatherDetailsObject, dateTime, icon, unit);
  } catch {
    () => {
      alert("please check internet connection");
    };
  }
}

function displayCurrentWeather(weatherDetailsObject, dateTime, icon, unit) {
  const city = localStorage.getItem("currentCityAndCountry").split(",")[0];
  document.querySelectorAll(".location").forEach((el) => (el.innerHTML = city));

  document.querySelectorAll(".weatherDescription").forEach((el) => {
    el.innerHTML = weatherDetailsObject.currentDescription;
    el.style.setProperty(
      "--weather-icon",
      `url('https://openweathermap.org/img/wn/${icon}.png')`
    );
  });

  document
    .querySelectorAll(".weatherHumidity")
    .forEach(
      (el) => (el.innerHTML = `${weatherDetailsObject.currentHumidity}%`)
    );

  document
    .querySelectorAll(".right-weatherDescription")
    .forEach((el) => (el.innerHTML = weatherDetailsObject.currentDescription));

  document
    .querySelectorAll(".right-weatherHumidity")
    .forEach(
      (el) => (el.innerHTML = `${weatherDetailsObject.currentHumidity}%`)
    );

  document
    .querySelectorAll(".date-time")
    .forEach((el) => (el.innerHTML = dateTime));
  const tempText = `${weatherDetailsObject.currentTemp} ${
    unit === "metric" ? "°C" : "°F"
  }`;

  document
    .querySelectorAll(".temperature")
    .forEach((el) => (el.innerHTML = tempText));

  document
    .querySelectorAll(".right-temperature")
    .forEach((el) => (el.innerHTML = tempText));

  document
    .querySelectorAll(".right-weatherWind")
    .forEach(
      (el) => (el.innerHTML = weatherDetailsObject.currentWindSpeed + " m/sec")
    );

  // Change the background image based on the current weather and chosen mode
  document.querySelector(
    ".weatherContainer"
  ).style.backgroundImage = `url('./imgs/${weatherDetailsObject.currentWeatherCondition.toLowerCase()}.jpg')`;

  document.querySelector(".todayWeather").style = "";
  const weatherForecast = (document.getElementById("weatherForecast").style =
    "");
  document.querySelector(".weatherDetailsCol").style = "";
  document.getElementById("greetUser").innerText = "";
}
