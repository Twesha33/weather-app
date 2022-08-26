function padMinutes(minutes) {
  let padded = `${minutes}`;
  if (padded.length < 2) {
    padded = "0" + minutes;
  }
  return padded;
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

  let date = document.querySelector(".day-time");
  let day = days[now.getDay()];
  let hour = now.getHours();
  let minutes = padMinutes(now.getMinutes());

  date.innerHTML = `${day} ${hour}:${minutes}`;
}

function displayForecast(response) {
  console.log(response.data);

  // let forecastElement = document.querySelector("#weather-forecast");

  // let days = ["Sunday", "Monday", "Tuesday", "Thursday", "Friday"];

  // let forecastHTML = `<div class="row text-center">`;
  // days.forEach(function (day) {
  //   forecastHTML =
  //     forecastHTML +
  //     `
  //       <div class="col prediction">
  //         <div class="days text-subtitle-3">${day}</div>
  //         <img
  //           src="https://openweathermap.org/img/wn/10d@2x.png"
  //           alt="Weather Icon"
  //           class="weatherEmoji"
  //           id="weather-today-icon"
  //         />
  //         <div class="highTemp text-subtitle-1">33°C</div>
  //         <div class="lowerTemp text-subtitle-2">13°C</div>
  //       </div>
  //     `;
  // });

  // forecastHTML = forecastHTML + `</div>`;
  // forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  let lat = coordinates.lat;
  let lon = coordinates.lon;
  let apiKey = "d764fc53cc8918e14f2c2991dc43a40d";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  console.log(apiUrl);
  //axios.get(apiUrl).then(displayForecast);
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
  let fahrenheitTemp = (currentTempCelsius * 9) / 5 + 32;
  document.querySelector("#temp-today").innerHTML = Math.round(fahrenheitTemp);
  let fahrenheitTempFeel = Math.round((currentFeelTempCelsius * 9) / 5 + 32);
  document.querySelector(
    "#temp-perceived"
  ).innerHTML = `${fahrenheitTempFeel}°F`;

  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
}

function setTempCelsius(event) {
  event.preventDefault();
  document.querySelector("#temp-today").innerHTML = currentTempCelsius;
  document.querySelector(
    "#temp-perceived"
  ).innerHTML = `${currentFeelTempCelsius}°C`;

  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
}

let currentTempCelsius = null;
let currentFeelTempCelsius = null;

let fahrenheitLink = document.querySelector(".fahrenheit");
fahrenheitLink.addEventListener("click", setTempFahrenheit);

let celsiusLink = document.querySelector(".celsius");
celsiusLink.addEventListener("click", setTempCelsius);

getFormattedTime();
initCityListeners();
initCurrentCityListeners();
searchCity("Amsterdam");
