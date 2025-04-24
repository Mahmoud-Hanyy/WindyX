import { getLastCity } from "./searchHistory.js";

export function getGreeting() {
  const city=getLastCity();
  if (!city || city=="") {
    return {
      greeting: "Hello in your first visit!",
      showWeather: false,
    };
  }
  const user = localStorage.getItem("loggedInUser");
  console.log(user);
  const name = user || "User";
  const greeting = `Hello, ${name}!`;
  return {
    greeting: greeting,
    showWeather: true,
  };
}

export function displayGreeting() {
  const { greeting, showWeather } = getGreeting();
  const greetingElement = document.getElementById("greetUser");
  greetingElement.innerHTML = greeting;
  console.log(showWeather);
  if (showWeather) {
    // Show weather information
    let userGreeting = getGreeting()["greeting"];
    greetingElement.innerHTML = userGreeting;
  } else {
    // Hide weather information
    document.querySelector(".todayWeather").style.display = "none";
    document.getElementById("weatherForecast").style.display = "none";
    document.querySelector(".weatherDetailsCol").style.display = "none";
  }
}
