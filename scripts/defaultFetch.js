import { fetchWeatherByCityAndCountry } from "./searchFetch.js";

const response = await fetch("./api.json");
const data = await response.json();
const apiKey = data.API_KEY;

/**
 * Retrieves the current geolocation data of the device.
 *
 * @function getGeolocationData
 * A function that uses the browser's Geolocation interface from the Web API.
 * It wraps the `navigator.geolocation.getCurrentPosition` in a Promise, which
 * resolves with a `GelocationPosition` object upon success.
 * If the operation fails, the Promise is rejected with an error.
 *
 * @returns {Promise<GeolocationCoordinates>}
 *
 * @example
 * getGeolocationData()
 *   .then(position => {
 *     console.log("Latitude:", position.coords.latitude);
 *     console.log("Longitude:", position.coords.longitude);
 *   })
 *   .catch(error => {
 *     console.log("Error fetching geolocation:", error);
 *   });
 */
export function getGeolocationData() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}

/**
 * Creates the Openweathermap endpoint URL based on the device's geolocation.
 *
 * @async
 * @function getOpenweathermapEndpoint
 * This async function that assembles the endpoint according to the current device
 * geolocation permissions, where it returns an endpoint that to request the
 * current device's weather data based on its coordinates retrieved from the
 * `getGeolocationData` function, or defaults to "City of London" coordinates.
 *
 * @param {string} apiKey - Openweathermap API's Key.
 * @returns {Promise<string>} The Openweathermap endpoint to request the
 * weather data from for the current device.
 *
 * @example
 * getOpenweathermapEndpoint(apiKey)
 *   .then( endpoint => {
 *     console.log("Openweathermap Endpoint:", endpoint);
 * })
 */
export async function getOpenweathermapEndpoint() {
  let long, lat;
  const baseUrl = "https://api.openweathermap.org/";
  const weatherByCityEndPoint = baseUrl + "geo/1.0/reverse";
  const limit = 1;

  try {
    const position = await getGeolocationData();
    long = position.coords.longitude;
    lat = position.coords.latitude;
  } catch {
    long = -0.09184;
    lat = 51.51279;
  }

  const endpoint = `${weatherByCityEndPoint}?lat=${lat}&lon=${long}&limit=${limit}&appid=${apiKey}`;
  return endpoint;
}

/**
 * Fetches the Openweathermap Endpoint to retrieve weather information for
 * current device.
 *
 * @async
 * @function fetchOpenweathermapEndpoint
 * @returns
 */
export async function fetchCityByDefault() {
  try {
    const cityName = localStorage.getItem("currentCityAndCountry");
    console.log(cityName);
    if (!cityName) {
      return;
    }
    fetchWeatherByCityAndCountry(cityName);
  } catch (error) {
    alert("Please check your internet connection");
  }
}

export async function fetchByCurrentGeolocation() {
  try {
    const url = await getOpenweathermapEndpoint(apiKey);
    const response = await fetch(url);
    const reversedGeolocation = await response.json();
    const cityName = reversedGeolocation[0].name;
    fetchWeatherByCityAndCountry(cityName);
    localStorage.setItem("currentCityAndCountry", cityName);
  } catch (error) {
    alert("Please check your internet connection");
  }
}
