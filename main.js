let searchBtn = document.getElementById("search-btn");
let inputBox = document.getElementById("input-box");
let weatherIcon = document.getElementById("weatherIcon");
let container = document.querySelector(".container");
let cardsContainer = document.querySelector(".cards");
let apiKey = "ba9f66b3720fbc382834b1da333553b1";

function getweatherDetails(cityName, lat, lon) {
  const weatherApiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;
  fetch(weatherApiUrl)
    .then((re) => re.json())
    .then((data) => {
      let theDays = [];
      let FiveDays = data.list.filter((forecast) => {
        let forecastDate = new Date(forecast.dt_txt).getDate();
        if (!theDays.includes(forecastDate)) {
          return theDays.push(forecastDate);
        }
      });
      cardsContainer.innerHTML = "";
      FiveDays.forEach((weatherItem) => {
        let imgsrc =
          weatherItem.weather[0].main == "Clear"
            ? "image/contrast.png"
            : weatherItem.weather[0].main == "Clouds"
            ? "image/cloudy.png"
            : weatherItem.weather[0].main == "Rain"
            ? "image/rain.png"
            : weatherItem.weather[0].main == "Drizzle"
            ? "image/drizzle.png"
            : "image/cloud.png";

        let newCards = `
    <div class="card">
            <p>${weatherItem.dt_txt.split(" ")[0]}</p>
            <img class="cardImg" src="${imgsrc}" />
            <h3 class="temp-2">${(weatherItem.main.temp - 273.15).toFixed(
              2
            )} °C.</h3>
            <p class="des" style="color: #62698c">${
              weatherItem.weather[0].description
            }</p>
            <p class="wind-2">Wind:: ${weatherItem.wind.speed} km/h</p>
    </div>
    `;
        cardsContainer.insertAdjacentHTML("beforeend", newCards);
        // cardsContainer.innerHTML += newCards;
      });
    });
}

async function checkWeather(city) {
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  let response = await fetch(url)
    .then((re) => re.json())
    .then((data) => {
      document.querySelector(".city").innerHTML = data.name;
      document.querySelector(".temp").innerHTML =
        Math.floor(data.main.temp) + "°C";
      document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
      document.querySelector(".wind").innerHTML = data.wind.speed + " km/h";

      if (data.weather[0].main == "Clear") {
        weatherIcon.src = "image/contrast.png";
      } else if (data.weather[0].main == "Clouds") {
        weatherIcon.src = "image/cloudy.png";
      } else if (data.weather[0].main == "Rain") {
        weatherIcon.src = "image/rain.png";
      } else if (data.weather[0].main == "Drizzle") {
        weatherIcon.src = "image/drizzle.png";
      } else if (data.weather[0].main == "Mist") {
        weatherIcon.src = "image/cloud.png";
      }

      let lon = data.coord.lon;
      let lat = data.coord.lat;
      let name = data.name;
      getweatherDetails(name, lat, lon);
      container.style.display = "flex";
      document.querySelector(".error").style.display = "none";
    })
    .catch((error) => {
      inputBox.value = "";
      document.querySelector(".error").style.display = "block";
      container.style.display = "none";
    });
}

searchBtn.addEventListener("click", () => {
  checkWeather(inputBox.value);
});

let dateNow = new Date().toDateString();
document.querySelector(".time-day p").innerHTML = dateNow;
