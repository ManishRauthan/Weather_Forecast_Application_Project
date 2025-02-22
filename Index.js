const cityInput = document.querySelector(".city-input");
const searchBtn = document.querySelector(".search-btn");

const weatherInfoSection = document.querySelector(".weather-info");
const notFoundSection = document.querySelector(".not-found");
const searchCitySection = document.querySelector(".search-city");

const countryTxt = document.querySelector(".country-txt");
const tempTxt = document.querySelector(".temp-txt");
const conditionTxt = document.querySelector(".condition-txt");
const humidityValueTxt = document.querySelector(".humidity-value-txt");
const windValueTxt = document.querySelector(".wind-value-txt");
const weatherSummaryimg = document.querySelector(".weather-summary-img");
const currentDateTxt = document.querySelector(".current-date-txt");

const forecastItemContainer = document.querySelector(".forcast-item-container");

const apiKey = "fcb829454a98e663294a5f6186bc8d86";

searchBtn.addEventListener("click", () => {
  if (cityInput.value.trim() != "") {
    updateWeatherInfo(cityInput.value);
    cityInput.value = "";
    cityInput.blur();
  }
});

cityInput.addEventListener("keydown", (event) => {
  if (event.key == "Enter" && cityInput.value.trim() != "") {
    updateWeatherInfo(cityInput.value);
    cityInput.value = "";
    cityInput.blur();
  }
});

async function getfetchData(endPoint, city) {
  const apiURL = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`;

  const response = await fetch(apiURL);

  return response.json();
}

function getWeatherIcon(id) {
  if (id <= 232) return "thunderstorm.png";
  if (id <= 321) return "drizzle.png";
  if (id <= 531) return "rain.png";
  if (id <= 622) return "snow.png";
  if (id <= 781) return "atmosphere.png";
  if (id <= 800) return "clear.png";
  else return "clouds.png";
}

function getCurrentDate() {
  const currentDate = new Date();
  const option = {
    weekday: "short",
    day: "2-digit",
    month: "short",
  };

  return currentDate.toLocaleDateString("en-GB", option);
}

async function updateWeatherInfo(city) {
  const weatherData = await getfetchData("weather", city);

  if (weatherData.cod != 200) {
    showDisplaySection(notFoundSection);
    return;
  }

  const {
    name: cityName,
    sys: { country },
    main: { temp, humidity },
    weather: [{ id, main }],
    wind: { speed },
  } = weatherData;

  countryTxt.textContent = `${cityName}, ${country}`;
  tempTxt.textContent = Math.round(temp) + "℃";
  conditionTxt.textContent = main;
  humidityValueTxt.textContent = humidity + "%";
  windValueTxt.textContent = speed + "M/s";

  currentDateTxt.textContent = getCurrentDate();
  weatherSummaryimg.src = `images/${getWeatherIcon(id)}`;

  await updateForecastsInfo(city);
  showDisplaySection(weatherInfoSection);
}

async function updateForecastsInfo(city) {
  const forecastsData = await getfetchData("forecast", city);

  const timeTaken = "12:00:00";
  const todayDate = new Date().toISOString().split("T")[0];

  forecastItemContainer.innerHTML = "";
  forecastsData.list.forEach((forecastWeather) => {
    if (
      forecastWeather.dt_txt.includes(timeTaken) &&
      !forecastWeather.dt_txt.includes(todayDate)
    ) {
      updateForecastItems(forecastWeather);
    }
  });
}

function updateForecastItems(weatherData) {
  console.log(weatherData);
  const {
    dt_txt: date,
    weather: [{ id }],
    main: { temp },
  } = weatherData;

  const dateTaken = new Date(date);
  const dateOption = {
    day: "2-digit",
    month: "short",
  };
  const dateResult = dateTaken.toLocaleDateString("en-US", dateOption);

  const forecastItem = `
    <div class="forcast-item">
      <h5 class="forcast-item-date regular-txt">${dateResult}</h5>
      <img src="images/${getWeatherIcon(id)}" class="forcast-item-image" />
      <h5 class="forcast-item-temp">${Math.round(temp)} ℃</h5>
     </div>
  `;

  forecastItemContainer.insertAdjacentHTML("beforeend", forecastItem);
}

function showDisplaySection(section) {
  [weatherInfoSection, searchCitySection, notFoundSection].forEach(
    (section) => (section.style.display = "none")
  );
  section.style.display = "flex";
}
