const apiKey = "38a9d66e51245ff08c7c7dacad74358d";

document.getElementById("getWeather").addEventListener("click", () => {
    const address = document.getElementById("address").value.trim();
    if (!address) {
        alert("Please enter a location.");
        return;
    }
    getCurrentWeather(address);
    getWeatherForecast(address);
});

function getCurrentWeather(location) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;

    const xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onload = () => {
        if (xhr.status === 200) {
            const data = JSON.parse(xhr.responseText);
            console.log(data);
            displayCurrentWeather(data);
        } else {
            alert("Failed to fetch current weather data.");
        }
    };
    xhr.send();
}

function getWeatherForecast(location) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to fetch weather forecast data.");
            }
            return response.json();
        })
        .then(data => {
          console.log(data);
            displayWeatherForecast(data);
        })
        .catch(error => alert(error.message));
}

function displayCurrentWeather(data) {
    const display = document.getElementById("weatherDisplay");
    display.innerHTML = `
        <div class="current-weather">
            <h2>Current Weather in ${data.name}</h2>
            <p>Temperature: ${data.main.temp}°C</p>
            <p>Weather Conditions: ${data.weather[0].description}</p>
            <p>Humidity: ${data.main.humidity}%</p>
            <p>Wind Speed: ${data.wind.speed} m/s</p>
        </div>
    `;
}

function displayWeatherForecast(data) {
    const display = document.getElementById("weatherDisplay");

    const dailyForecast = {};
    data.list.forEach(item => {
        const date = item.dt_txt.split(" ")[0];
        if (!dailyForecast[date]) {
            dailyForecast[date] = [];
        }
        dailyForecast[date].push(item);
    });

    function getWeatherIcon(description) {
        if (description.includes("clear")) return "☀️";
        if (description.includes("overcast clouds")) return "🌥️";
        if (description.includes("broken clouds")) return "🌤️";
        if (description.includes("clouds")) return "☁️";
        if (description.includes("rain")) return "🌧️";
        if (description.includes("thunderstorm")) return "⛈️";
        if (description.includes("snow")) return "❄️";
        return "🌫️";
    }

    const forecastHTML = Object.keys(dailyForecast)
        .map(date => {
            const dayData = dailyForecast[date];
            const temperatures = dayData.map(item => item.main.temp);
            const minTemp = Math.min(...temperatures);
            const maxTemp = Math.max(...temperatures);
            const description = dayData[0].weather[0].description;
            const weatherIcon = getWeatherIcon(description.toLowerCase());

            return `
                <div class="forecast-day">
                    <h3>${new Date(date).toLocaleDateString()}</h3>
                    <p>${weatherIcon} Weather Conditions: ${description}</p>
                    <p>❄️ Min Temperature: <span class='min-temp'>${minTemp}°C</span></p>
                    <p>☀️ Max Temperature: <span class='max-temp'>${maxTemp}°C</span></p>
                </div>
            `;
        })
        .join("");

    display.innerHTML += `
        <h2>5-Day Forecast</h2>
        ${forecastHTML}
    `;
}
