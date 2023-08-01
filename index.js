"use stric";

async function fetchWeather() {
  let searchInput = document.getElementById("search").value;
  const weatherDataSection = document.getElementById("weather-data");
  weatherDataSection.style.display = "block";
  const apiKey = "0e9e9e1579b76aeefd0e76981f9b6abe";

  if (searchInput === "") {
    weatherDataSection.innerHTML = `
    <div>
      <h2>Empty Input!</h2>
      <p>Please try again with a valid <u>city</u></p>
    </div>
    `;
    return;
  }

  // La siguiente funcion obtiene la informacion de longitud y latitud de algun lugar basado en el nombre escrito o codigo zip
  async function getLonAndLat() {
    const countryCode = 57;
    geocodeURL = `http://api.openweathermap.org/geo/1.0/direct?q=${searchInput.replace(
      " ",
      "%20"
    )}&limit=1&appid=${apiKey}`;

    const response = await fetch(geocodeURL);
    if (!response.ok) {
      console.log("Bad response! ", response.status);
      return;
    }

    const data = await response.json();

    if (data.length === 0) {
      console.log("Something went wrong here!");
      weatherDataSection.innerHTML = `
      <div>
      <h2>Invalid Input: "${searchInput}"</h2>
      <p>Please try again with a valid <u>city name</u>.</p>
      </div>
      `;
      return;
    } else {
      return data[0];
    }
  }

  // obtiene la informacion del clima de acuerdo a la latitud y longitud pasados como parametros
  async function getWeatherData(lon, lat) {
    const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;

    const response = await fetch(weatherURL);

    if (!response.ok) {
      console.log("Bad response! ", response.status);
      return;
    }
    const data = await response.json();
    weatherDataSection.style.display = "flex";
    weatherDataSection.innerHTML = `
    <img src="https://openweathermap.org/img/wn/${
      data.weather[0].icon
    }.png" alt="${data.weather[0].description}" width="100" />
    <div>
    <h2>${data.name}</h2>
    <p><strong>Temperature:</strong> ${Math.round(
      data.main.temp - 273.15
    )}°C</p>
    <p><strong>Description:</strong> ${data.weather[0].description}</p>
    </div>
    `;
  }

  document.getElementById("search").value = "";
  const geoCodeData = await getLonAndLat();
  getWeatherData(geoCodeData.lon, geoCodeData.lat);
}
