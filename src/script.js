let currentCityData = null;
let forecastData = null;
let currentTempCelsius = null;
let currentFeelTempCelsius = null;
let isFahrenheit = false;
const fahrenheitLink = document.querySelector(".fahrenheit");
const celsiusLink = document.querySelector(".celsius");

function padMinutes(minutes) {
  let padded = `${minutes}`;
  if (padded.length < 2) {
    padded = "0" + minutes;
  }
  return padded;
}

function getUnit() {
  if (isFahrenheit) {
    return "°F";
  } else {
    return "°C";
  }
}

function toFahrenheit(metric) {
  return Math.round((metric * 9) / 5 + 32);
}

function getFormattedTime() {
  let now = new Date();

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let dateElement = document.querySelector(".day-time");
  let day = days[now.getDay()];
  let hour = now.getHours();
  let minutes = padMinutes(now.getMinutes());

  dateElement.innerHTML = `${day} ${hour}:${minutes}`;
}

function formatForecastDay(timestamp) {
  let date = new Date(timestamp * 1000);

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let day = days[date.getDay()];

  return day;
}

function displayForecast(data) {
  let forecast = data.daily;
  let forecastElement = document.querySelector("#weather-forecast");
  let unit = getUnit();

  let forecastHTML = `<div class="row text-center">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 5) {
      let maxTemp = forecastDay.temp.max;
      let minTemp = forecastDay.temp.min;

      if (isFahrenheit) {
        maxTemp = toFahrenheit(maxTemp);
        minTemp = toFahrenheit(minTemp);
      }

      forecastHTML =
        forecastHTML +
        `
         <div class="col prediction">
           <div class="days text-subtitle-3">${formatForecastDay(
             forecastDay.dt
           )}</div>
           <img
             src="https://openweathermap.org/img/wn/${
               forecastDay.weather[0].icon
             }@2x.png"
             alt="Weather Icon"
             class="weatherEmoji"
             id="weather-today-icon"
           />
           <div class="highTemp text-subtitle-1">${Math.round(
             maxTemp
           )}${unit}</div>
           <div class="lowerTemp text-subtitle-2">${Math.round(
             minTemp
           )}${unit}</div>
         </div>
       `;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  let lat = coordinates.lat;
  let lon = coordinates.lon;
  let apiKey = "a43564c91a6c605aeb564c9ed02e3858";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

  axios.get(apiUrl).then(function (response) {
    forecastData = response.data;
    displayForecast(forecastData);
  });
}

function displayWeather(response) {
  let changeCity = response.data.name;
  let currentCountry = response.data.sys.country;
  document.querySelector(
    ".cityName"
  ).innerHTML = `${changeCity}, ${currentCountry}`;

  currentTempCelsius = Math.round(response.data.main.temp);
  document.querySelector("#temp-today").innerHTML = currentTempCelsius;

  currentFeelTempCelsius = Math.round(response.data.main.feels_like);
  document.querySelector(
    "#temp-perceived"
  ).innerHTML = `${currentFeelTempCelsius}°C`;

  let humidity = Math.round(response.data.main.humidity);
  document.querySelector("#humidity-perc").innerHTML = `${humidity}%`;

  let weatherDescription = response.data.weather[0].description;
  document.querySelector(".forecast").innerHTML = weatherDescription;

  let windSpeed = Math.round(response.data.wind.speed * 3.6);
  document.querySelector("#wind-speed").innerHTML = `${windSpeed}km/h`;

  let weatherIcon = response.data.weather[0].icon;
  document
    .querySelector("#weather-today-icon")
    .setAttribute(
      "src",
      `https://openweathermap.org/img/wn/${weatherIcon}@2x.png`
    );

  document
    .querySelector("#weather-today-icon")
    .setAttribute("alt", `${weatherDescription}`);

  getForecast(response.data.coord);
}

function searchCity(cityInput) {
  let apiKey = "d764fc53cc8918e14f2c2991dc43a40d";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityInput}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayWeather);
}

function setCity(event) {
  event.preventDefault();
  let cityInput = document.querySelector("#search-input").value;
  searchCity(cityInput);
}

function initCityListeners() {
  let inputCity = document.querySelector("#city-form");
  inputCity.addEventListener("submit", setCity);
}

function getPosition(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let apiKey = "d764fc53cc8918e14f2c2991dc43a40d";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayWeather);
}

function initPosition(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(getPosition);
}

function initCurrentCityListeners() {
  let currentCity = document.querySelector("#current-city-btn");
  currentCity.addEventListener("click", initPosition);
}

function setTempFahrenheit(event) {
  event.preventDefault();
  isFahrenheit = true;

  let unit = getUnit();
  document.querySelector("#temp-today").innerHTML =
    toFahrenheit(currentTempCelsius);
  document.querySelector("#temp-perceived").innerHTML = `${toFahrenheit(
    currentFeelTempCelsius
  )}${unit}`;

  displayForecast(forecastData);

  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
}

function setTempCelsius(event) {
  event.preventDefault();
  isFahrenheit = false;

  let unit = getUnit();
  document.querySelector("#temp-today").innerHTML = currentTempCelsius;
  document.querySelector(
    "#temp-perceived"
  ).innerHTML = `${currentFeelTempCelsius}${unit}`;

  displayForecast(forecastData);

  fahrenheitLink.classList.remove("active");
  celsiusLink.classList.add("active");
}

fahrenheitLink.addEventListener("click", setTempFahrenheit);
celsiusLink.addEventListener("click", setTempCelsius);

getFormattedTime();
initCityListeners();
initCurrentCityListeners();
searchCity("Amsterdam");
