const apiKey= '9853aca6055d1f5c122be191411d006b';
const baseUrl = "https://api.openweathermap.org/";

const weatherByCityEndPoint=baseUrl+ "data/2.5/forecast";

//storage check should be handled here before fetching from the api
function fetchWeatherByCity(city,unit){

let url=weatherByCityEndPoint+`?q=${city}&units=${unit}&appid=${apiKey}`;
 fetch(url)
 .then(response=>{

    if(!response.ok){
        alert("Please enter city's name correctly");
        document.querySelector(".searchInput").value=""    }
    return response.json();
 })
 .then(weatherData=>{
  let location = weatherData.city.name;
    let currentWeather = weatherData.list[0];
    let windSpeed=currentWeather.wind.speed;

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
     const icon=processedDays[0].icon;
      const firstDay = processedDays[0];
      let dateTime = firstDay.date;
      displayDailyForecast(processedDays.slice(1), unit);
          
      displayCurrentWeather(location,currentTemp,currentDescription,
        currentHumidity,dateTime,unit,windSpeed,icon);

      }
   
   )
 .catch(_=>{
    alert("please check internet connection")
  }
 );
}



function displayCurrentWeather(city,currentTemp,currentDescription,currentHumidity,dateTime,unit,windSpeed,icon){
  document.querySelectorAll(".location").forEach(el => el.innerHTML = city);
  document.querySelectorAll(".weatherDescription").forEach(el =>{ el.innerHTML = currentDescription

    el.style.setProperty('--weather-icon', `url('https://openweathermap.org/img/wn/${icon}.png')`);

  });
  document.querySelectorAll(".weatherHumidity").forEach(el => el.innerHTML = `${currentHumidity}%`);
  document.querySelectorAll(".right-weatherDescription").forEach(el => el.innerHTML = currentDescription);
  document.querySelectorAll(".right-weatherHumidity").forEach(el => el.innerHTML = `${currentHumidity}%`);
  document.querySelectorAll(".date-time").forEach(el => el.innerHTML = dateTime);
  const tempText = `${currentTemp} ${unit === 'metric' ? '°C' : '°F'}`;
  document.querySelectorAll(".temperature").forEach(el => el.innerHTML = tempText);
  document.querySelectorAll(".right-temperature").forEach(el => el.innerHTML = tempText);
  document.querySelectorAll(".right-weatherWind").forEach(el => el.innerHTML = windSpeed+" m/sec");
  

}


function displayDailyForecast(days, unit) {
  const forecastDays = days.slice(0, 3);
  
  forecastDays.forEach((day, index) => {
    const dayElement = document.getElementById(`day${index + 1}`);
    if (dayElement) {
      // Assuming the structure is <p>date</p><img><p>temp</p>
      dayElement.children[0].textContent = day.date;
      dayElement.children[1].src = `https://openweathermap.org/img/wn/${day.icon}.png`;
      dayElement.children[1].alt = day.description;
      dayElement.children[2].textContent = 
        `${Math.round(day.temp)}${unit === 'metric' ? '°C' : '°F'}`;
    }
  });
}
document.querySelector('.dropMenu').addEventListener('change',function(){
  city = document.querySelector(".searchInput").value="";

  let cityValue= this.value;
  let unit = document.getElementById("degreeToggle").checked ? 'imperial' : 'metric'; 

  
fetchWeatherByCity(cityValue,unit)
})

document.getElementById("searchIcon").addEventListener("click", function () {
  let city = document.querySelector(".searchInput").value;
  let unit = document.getElementById("degreeToggle").checked ? 'imperial' : 'metric'; 
  if (city) {
    fetchWeatherByCity(city, unit); 
    const dropMenu = document.querySelector('.dropMenu');
    dropMenu.selectedIndex = 0
  }
});

document.getElementById("degreeToggle").addEventListener("change", function() {
  let  citySearchValue=document.querySelector(".searchInput").value
  let  cityMenuValue=document.querySelector('.dropMenu').value
  let unit = this.checked ? 'imperial' : 'metric'; 

  if(citySearchValue==""){
    cityMenuValue= document.querySelector('.dropMenu').value
    fetchWeatherByCity(cityMenuValue, unit); 

  }else{
    fetchWeatherByCity(citySearchValue, unit); 

  }
  
  
});

