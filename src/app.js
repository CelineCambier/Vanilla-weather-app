function formatDate(timestamp) {
    let date = new Date(timestamp);
    let hours = date.getHours();
    if(hours < 10) {
       hours = `0${hours}`;
    }
    let minutes = date.getMinutes();
    if(minutes < 10) {
       minutes = `0${minutes}`;
    }
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let day = days[date.getDay()];
    return `${day} ${hours}:${minutes}`
}

function formatDay(timestamp) {
    let date = new Date(timestamp * 1000);
    let day = date.getDay();
    let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return days[day];
}

function displayForecast(response) {
    console.log(response.data);
    let forecast = response.data.daily;

    let forecastElement = document.querySelector("#forecast");

    let forecastHTML = `<div class="row">`;
    forecast.forEach(function(forecastDay, index) {
        if (index > 0 && index < 7) {
            forecastHTML = forecastHTML +
        `
            <div class="col-2">
                <div class="weather-forecast-date">${formatDay(forecastDay.time)}</div>
                <img 
                    src="http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${forecastDay.condition.icon}.png" 
                    alt=""
                    width="42"
                />
                <div class="weather-forecast-temperatures">
                    <span class="weather-forecast-temperature-max">
                       ${Math.round(forecastDay.temperature.maximum)}°
                    </span> 
                    <span class="weather-forecast-temperature-min">
                        ${Math.round(forecastDay.temperature.minimum)}°
                    </span>
                </div>
            </div>
        `;
        }
        
    })
    
    forecastHTML = forecastHTML + '</div>';
    forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
    let apiKey = "e48e1aab0acf4fc215c13f02ct8bo5ab";
    let apiUrl = `https://api.shecodes.io/weather/v1/forecast?lon=${coordinates.longitude}&lat=${coordinates.latitude}&key=${apiKey}&units=imperial`;
    axios.get(apiUrl).then(displayForecast);
}

function displayTemperature(response){
    let temperatureElement = document.querySelector("#temperature");
    let cityElement = document.querySelector("#city");
    let descriptionElement = document.querySelector("#description");
    let humidityElement = document.querySelector("#humidity");
    let windElement = document.querySelector("#wind");
    let dateElement = document.querySelector("#date");
    let iconElement = document.querySelector("#icon");

    celciusTemperature = response.data.temperature.current;

    temperatureElement.innerHTML = Math.round(celciusTemperature);
    cityElement.innerHTML = response.data.city;
    descriptionElement.innerHTML = response.data.condition.description;
    humidityElement.innerHTML = response.data.temperature.humidity;
    windElement.innerHTML = Math.round(response.data.wind.speed*0.6213711922);
    dateElement.innerHTML = formatDate(response.data.time * 1000);
    iconElement.setAttribute("src", `http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${response.data.condition.icon}.png`); 
    iconElement.setAttribute("alt", response.data.condition.description);

    getForecast(response.data.coordinates);
}

function search(city) {
    let apiKey = "e48e1aab0acf4fc215c13f02ct8bo5ab";
    let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=imperial`;
    axios.get(apiUrl).then(displayTemperature);
}

function searchLocation(position) {
    let cityInputElement = document.querySelector("#city-input");
    cityInputElement.value = "";
    let apiKey = "e48e1aab0acf4fc215c13f02ct8bo5ab";
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;
    let apiUrl = `https://api.shecodes.io/weather/v1/current?lon=${lon}&lat=${lat}&key=${apiKey}&units=imperial`;
    axios.get(apiUrl).then(displayTemperature);
}

function handleSubmit(event) {
  event.preventDefault();
  let cityInputElement = document.querySelector("#city-input");
  search(cityInputElement.value);
}

function getCurrentPosition(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchLocation);
}

let form = document.querySelector("#search-form");
form.addEventListener("submit", handleSubmit);

let positionButton = document.querySelector(".myPositionButton");
positionButton.addEventListener("click", getCurrentPosition);

search("London");
