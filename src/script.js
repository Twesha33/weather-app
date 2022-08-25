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

function padMinutes(minutes) {
  let padded = `${minutes}`;
  if (padded.length < 2) {
    padded = "0" + minutes;
  }
  return padded;
}

getFormattedTime();

function displayWeather(response) {
  let changeCity = response.data.name;
  let currentCountry = response.data.sys.country;
  document.querySelector(
    ".cityName"
  ).innerHTML = `${changeCity}, ${currentCountry}`;

  let currentTemp = Math.round(response.data.main.temp);
  document.querySelector("#temp-today").innerHTML = currentTemp;

  let currentFeelTemp = Math.round(response.data.main.feels_like);
  document.querySelector(".tempPerceived").innerHTML = `${currentFeelTemp}°C`;

  let humidity = Math.round(response.data.main.humidity);
  document.querySelector("#humidity-perc").innerHTML = `${humidity}%`;

  let weatherDescription = response.data.weather[0].description;
  document.querySelector(".forecast").innerHTML = weatherDescription;

  let windSpeed = Math.round(response.data.wind.speed * 3.6);
  document.querySelector("#wind-speed").innerHTML = `${windSpeed}km/h`;
}

function searchCity(cityInput) {
  let apiKey = "d764fc53cc8918e14f2c2991dc43a40d";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityInput}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayWeather);
}

searchCity("Amsterdam");

function setCity(event) {
  event.preventDefault();
  let cityInput = document.querySelector("#search-input").value;
  searchCity(cityInput);
}

function initCityListeners() {
  let inputCity = document.querySelector("#city-form");
  inputCity.addEventListener("submit", setCity);
}

initCityListeners();

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

initCurrentCityListeners();
