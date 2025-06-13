const API_KEY = "f4ad2624110bc8ec8d654285cfde7111";

const locationEl = document.getElementById("location");
const temperatureEl = document.getElementById("temperature");
const descriptionEl = document.getElementById("description");
const humidityEl = document.getElementById("humidity");
const windEl = document.getElementById("wind");
const iconEl = document.getElementById("icon");
const errorEl = document.getElementById("error");
const searchForm = document.getElementById("search-form");
const cityInput = document.getElementById("city-input");

// Fetch weather by coordinates
function fetchWeather(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

  fetch(url)
    .then((res) => {
      if (!res.ok) throw new Error("Failed to fetch weather data");
      return res.json();
    })
    .then(updateUI)
    .catch(showError);
}

// Fetch weather by city name
function fetchWeatherByCity(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

  fetch(url)
    .then((res) => {
      if (!res.ok) throw new Error("City not found");
      return res.json();
    })
    .then(updateUI)
    .catch(showError);
}

// Update UI with weather data
function updateUI(data) {
  errorEl.textContent = "";
  locationEl.textContent = `${data.name}, ${data.sys.country}`;
  temperatureEl.textContent = `${Math.round(data.main.temp)}°C`;
  descriptionEl.textContent = data.weather[0].description;
  humidityEl.textContent = data.main.humidity;
  windEl.textContent = (data.wind.speed * 3.6).toFixed(1); // m/s to km/h
  iconEl.src = `http://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;
  iconEl.alt = data.weather[0].description;
}

// Show error messages in UI
function showError(err) {
  errorEl.textContent = err.message;
  locationEl.textContent = "--";
  temperatureEl.textContent = "--°C";
  descriptionEl.textContent = "--";
  humidityEl.textContent = "--";
  windEl.textContent = "--";
  iconEl.src = "";
  iconEl.alt = "";
}

// Try getting user location on load
function getUserLocation() {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        fetchWeather(pos.coords.latitude, pos.coords.longitude);
      },
      (err) => {
        errorEl.textContent = "Location access denied. Please search for city.";
        locationEl.textContent = "--";
      }
    );
  } else {
    errorEl.textContent = "Geolocation not supported. Please search for city.";
  }
}

// Search form submit handler
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const city = cityInput.value.trim();
  if (city) {
    fetchWeatherByCity(city);
    cityInput.value = "";
  }
});

// Initialize
getUserLocation();
