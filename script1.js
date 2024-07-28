let enteryOfCity = document.getElementById("enteryOfCity"),
  btnsearch = document.getElementById("btnsearch"),
  locationbtn = document.getElementById("locationbtn"),
  api_key = "578b0ea7e9645759733f8b4ff554ab1f",
  currentWeatherCard = document.querySelector(".weather-left .card"),
  fiveDaysForecastCard = document.getElementById("dayforecast"),
  aqiCard = document.querySelectorAll(".highlights .card")[0],
  sunriseElement = document.getElementById("sunrise"),
  sunsetElement = document.getElementById("sunset"),
  humidityVal = document.getElementById("humidityVal"),
  pressureVal = document.getElementById("pressureVal"),
  visibilityVal = document.getElementById("visibilityVal"),
  windSpeedVal = document.getElementById("windspeedVal"),
  feelsVal = document.getElementById("feelsVal"),
  hourlyForecastCard = document.getElementById("hourly-forecast"),
  aqilist = ["good", "fair", "moderate", "poor", "verry poor"];

function getWeatherDetails(name, lat, lon, country, state) {
  let FORECAST_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${api_key}`,
    WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}`,
    AIR_POLLUTION_API_URL = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${api_key}`,
    days = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ],
    months = [
      "jan",
      "feb",
      "mar",
      "apr",
      "may",
      "jun",
      "jul",
      "aug",
      "sep",
      "oct",
      "nov",
      "dec",
    ];

  fetch(AIR_POLLUTION_API_URL)
    .then((res) => res.json())
    .then((data) => {
      let { co, no, no2, o3, so2, pm2_5, pm10, nh3 } = data.list[0].components;
      aqiCard.innerHTML = `
       <div class="card-head">
                <p>Air Quality Index</p>
                <p class="air-index aqi-${data.list[0].main.temp}">${
        aqilist[data.list[0].main.aqi - 1]
      }</p>
              </div>
              <div class="air-indices">
                <i class="fa-regular fa-wind fa-3x"></i>
                <div class="item">
                  <p>PM2.5</p>
                  <h2>${pm2_5}</h2>
                </div>
                <div class="item">
                  <p>PM10</p>
                  <h2>${pm10}</h2>
                </div>
                <div class="item">
                  <p>S02</p>
                  <h2>${so2}</h2>
                </div>
                <div class="item">
                  <p>C0</p>
                  <h2>${co}</h2>
                </div>
                <div class="item">
                  <p>NO</p>
                  <h2>${no}</h2>
                </div>
                <div class="item">
                  <p>NO2</p>
                  <h2>${no2}</h2>
                </div>
                <div class="item">
                  <p>NH3</p>
                  <h2>${nh3}</h2>
                </div>
                <div class="item">
                  <p>03</p>
                  <h2>${o3}</h2>
                </div>
              </div>
    `;
    })
    .catch(() => {
      alert("failed to fetch Air Quality INDEX");
    });

  fetch(WEATHER_API_URL)
    .then((res) => res.json())
    .then((data) => {
      let date = new Date();
      console.log(currentWeatherCard);
      currentWeatherCard.innerHTML = `
                 <div class="current-weather">
                        <div class="details">
                            <p>NOW</p>
                            <h2>${(data.main.temp - 273.15).toFixed(
                              2
                            )}&deg;C</h2>
                            <p>${data.weather[0].description}</p>
                        </div>
                        <div class="weather-icon">
                            <img src="https://openweathermap.org/img/wn/${
                              data.weather[0].icon
                            }@2x.png" alt="cloud image">
                        </div>
                    </div>
                    <hr>
                    <div class="card-footer">
                        <p><i class="fa-light fa-calendar"></i> ${
                          days[date.getDay()]
                        },${date.getDate()},${
        months[date.getMonth()]
      } ${date.getFullYear()}</p>
                        <p><i class="fa-light fa-location-dot"></i>${name},${country}</p>
                    </div>
            `;
      let { sunrise, sunset } = data.sys,
        { timezone, visibility } = data,
        { humidity, pressure, feels_like } = data.main,
        { speed } = data.wind,
        sRiseTime = moment
          .utc(sunrise, "x")
          .add(timezone, "seconds")
          .format("hh:mm A"),
        sSetTime = moment
          .utc(sunset, "x")
          .add(timezone, "seconds")
          .format("hh:mm A");
      console.log(sunriseElement, sunsetElement);
      sunriseElement.innerHTML = `${sRiseTime}`;
      sunsetElement.innerHTML = `${sSetTime}`;

      humidityVal.innerHTML = `${humidity}%`;
      pressureVal.innerHTML = `${pressure}hPa`;
      visibilityVal.innerHTML = `${visibility / 1000}km`;
      windSpeedVal.innerHTML = `${speed}m/s`;
      feelsVal.innerHTML = `${(feels_like - 273.15).toFixed(2)}&deg;C`;
    })
    .catch((error) => {
      console.log(error);
      alert("failed to fetch current weather");
    });

  fetch(FORECAST_API_URL)
    .then((res) => res.json())
    .then((data) => {
      let hourlyForecast = data.list;
      hourlyForecastCard.innerHTML = "";
      for (let i = 0; i <= 7; i++) {
        let hrForecastDate = new Date(hourlyForecast[i].dt_txt);
        let hr = hrForecastDate.getHours();
        let a = "PM";
        if (hr < 12) a = "AM";
        if (hr == 0) hr = 12;
        if (hr > 12) hr = hr - 12;
        hourlyForecastCard.innerHTML += `
         <div class="card">
              <p>${hr} ${a}</p>
              <img
                src="https://openweathermap.org/img/wn/${
                  hourlyForecast[i].weather[0].icon
                }.png"
                alt="weather4"
              />
              <p>${(hourlyForecast[i].main.temp - 273.15).toFixed(2)}&deg;C</p>
            </div>
        
        `;
      }
      let uniqueForecastDays = [];
      let fiveDaysForecast = data.list.filter((forecast) => {
        let forecastDate = new Date(forecast.dt_txt).getDate();
        if (!uniqueForecastDays.includes(forecastDate)) {
          return uniqueForecastDays.push(forecastDate);
        }
      });
      console.log(fiveDaysForecast);
      console.log(fiveDaysForecastCard ,"=========");
      for (let i = 1; i < fiveDaysForecast.length; i++) {
        let date = new Date(fiveDaysForecast[i].dt_txt);
        fiveDaysForecastCard.innerHTML += `
            <div class="forecast-item">
                        <div class="icon-wrapper">
                            <img src="https://openweathermap.org/img/wn/${
                              fiveDaysForecast[i].weather[0].icon
                            }.png" alt="cloud2 image">
                            <span>${(
                              fiveDaysForecast[i].main.temp - 273.15
                            ).toFixed(2)}&deg;C</span>
                        </div>
                        <p>${date.getDate()} ${months[date.getMonth()]}</p>
                        <p>${days[date.getDay()]}</p>
                      </div>
            `;
      }
      console.log(fiveDaysForecastCard,"-----");
    })
    .catch((error) => {
      console.log(error,"----");
      alert("failed to fetch weather forecast");
    });
}

function getCityCoordinates() {
  let cityName = enteryOfCity.value.trim();
  enteryOfCity.value = "";
  if (!cityName) return;
  let GEOCODING_API_URL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${api_key}`;
  fetch(GEOCODING_API_URL)
    .then((res) => res.json())
    .then((data) => {
      let { name, lat, lon, country, state } = data[0];
      getWeatherDetails(name, lat, lon, country, state);
    })
    .catch(() => {
      alert(`failed to fetch coordinates of ${cityName}`);
    });
}

function getUserCoordinates() {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      let { latitude, longitude } = position.coords;
      let REVERSE_GEOCODING_URL = `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${api_key}`;

      fetch(REVERSE_GEOCODING_URL)
        .then((res) => res.json())
        .then((data) => {
          let { name, country, state } = data[0];
          getWeatherDetails(name, latitude, longitude, country, state);
        })
        .catch(() => {
          alert("failed to catch the usercoordinates");
        });
    },
    (error) => {
      if (error.code === error.PERMISSION_DENIED) {
        alert("geolocation permission is denied please reset");
      }
    }
  );
}

btnsearch.addEventListener("click", getCityCoordinates);
locationbtn.addEventListener("click", getUserCoordinates);
enteryOfCity.addEventListener(
  "keyup",
  (e) => e.key === "Enter" && getCityCoordinates()
);
window.addEventListener("load", getUserCoordinates);
