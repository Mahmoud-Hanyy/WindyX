const apiKey= '9853aca6055d1f5c122be191411d006b';
const baseUrl = "https://api.openweathermap.org/";

const weatherByCityEndPoint=baseUrl+ "data/2.5/forecast";

function fetchWeatherByCity(city,unit){

let url=weatherByCityEndPoint+`?q=${city}&units=${unit}&appid=${apiKey}`;

 fetch(url)
 .then(response=>{

    if(!response.ok){
        alert("Please enter city's name correctly");
    }
    return response.json();
 })
 .then(weatherData=>{
  let location = weatherData.city.name;
    let currentWeather = weatherData.list[0];
    let currentTemp = currentWeather.main.temp;
    let currentDescription = currentWeather.weather[0].description;
    let currentHumidity = currentWeather.main.humidity;
 
    const dailyForecasts = {};
      weatherData.list.forEach(forecast => {
        const date = new Date(forecast.dt * 1000);
        const dateString = date.toLocaleDateString('en-US', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        });
        if (!dailyForecasts[dateString]) {
          dailyForecasts[dateString] = [];
        }
        dailyForecasts[dateString].push(forecast);
      });
      
      const dayKeys = Object.keys(dailyForecasts).slice(0, 4);
      
      //   get the forecast with the highest temperature
      const processedDays = dayKeys.map(dayKey => {
        const dayForecasts = dailyForecasts[dayKey];
        
        // Find the forecast with the highest temperature
        let maxTempForecast = dayForecasts.reduce((max, forecast) => {
          return forecast.main.temp > max.main.temp ? forecast : max;
        }, dayForecasts[0]);
        
        const date = new Date(maxTempForecast.dt * 1000);
        return {
          date: date.toLocaleDateString('en-US', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          }),
          temp: maxTempForecast.main.temp,
          icon: maxTempForecast.weather[0].icon,
          description: maxTempForecast.weather[0].description
        };
      });
      
      const firstDay = processedDays[0];
      let dateTime = firstDay.date;
            
      displayDailyForecast(processedDays.slice(1), unit);
          
      displayCurrentWeather(location,currentTemp,currentDescription,currentHumidity,dateTime,unit);
    }
   
   )
 .catch(_=>{
    alert("please chech internet connection")
  }
 );
}



function displayCurrentWeather(city,currentTemp,currentDescription,currentHumidity,dateTime,unit){
  document.querySelector(".location").innerHTML=city;
    document.querySelectorAll(".weatherDescription").forEach(el => el.innerHTML = currentDescription);
    document.querySelector(".weatherHumidity").innerHTML = currentHumidity;
    document.querySelector(".date-time").innerHTML=dateTime;
if(unit=='metric'){
    document.querySelectorAll(".temperature").forEach(el => el.innerHTML = currentTemp+" °C");

}else{
  document.querySelectorAll(".temperature").forEach(el => el.innerHTML = currentTemp+" °F");

}

}


function displayDailyForecast(days, unit) {
  const forecastContainer = document.querySelector('.weatherForcast');
  forecastContainer.innerHTML = '';
  
  days.forEach(day => {
    const dayElement = document.createElement('div');
    dayElement.className = 'day';
    
    dayElement.innerHTML = `
      <p>${day.date}</p>
      <img src="https://openweathermap.org/img/wn/${day.icon}.png" alt="${day.description}">
      <p>${Math.round(day.temp)}${unit === 'metric' ? '°C' : '°F'}</p>
    `;
    
    forecastContainer.appendChild(dayElement);
  });
}

document.querySelector('.dropMenu').addEventListener('change',function(){
  let value= this.value;
  checkWeatherUnit(value);

})

document.getElementById("search-button").addEventListener("click", function () {
  let city = document.querySelector(".searchInput").value;
  let unit = document.getElementById("degree").checked ? 'imperial' : 'metric'; 
  if (city) {
    fetchWeatherByCity(city, unit); 
  }
});

document.getElementById("degree").addEventListener("change", function () {
  let city = document.querySelector(".searchInput").value;
  let unit = this.checked ? 'imperial' : 'metric'; 
  if (city) {
    fetchWeatherByCity(city, unit); 
  }
});