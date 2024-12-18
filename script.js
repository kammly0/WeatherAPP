const apiKey = '9bfa99fffea4f23e3e01be8849025063';
const currentWeatherElement = document.getElementById('current-weather');
const forecastElement = document.getElementById('forecast');

// Funkcja do uzyskiwania lokalizacji użytkownika
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(fetchWeather, showError);
    } else {
        currentWeatherElement.textContent = 'Geolokalizacja nie jest wspierana przez Twoją przeglądarkę.';
    }
}

// Funkcja do pobrania pogody
async function fetchWeather(position) {
    const { latitude, longitude } = position.coords;
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&lang=pl&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&lang=pl&appid=${apiKey}`;
    
    try {
        const weatherResponse = await fetch(weatherUrl);
        const weatherData = await weatherResponse.json();

        const forecastResponse = await fetch(forecastUrl);
        const forecastData = await forecastResponse.json();

        displayCurrentWeather(weatherData);
        displayForecast(forecastData);
    } catch (error) {
        currentWeatherElement.textContent = 'Nie udało się pobrać danych pogodowych.';
    }
}

// Wyświetlanie aktualnej pogody
function displayCurrentWeather(data) {
    const { main, weather, wind, name } = data;
    currentWeatherElement.innerHTML = `
        <h2>Aktualna pogoda w ${name}</h2>
        <p>${weather[0].description}</p>
        <p>Temperatura: ${main.temp}°C</p>
        <p>Wilgotność: ${main.humidity}%</p>
        <p>Prędkość wiatru: ${wind.speed} m/s</p>
        <p>Ciśnienie: ${main.pressure} hPa</p>
    `;
}

// Wyświetlanie prognozy na 5 dni
function displayForecast(data) {
    const dailyForecast = data.list.filter(item => item.dt_txt.includes('12:00:00')).slice(0, 5);
    forecastElement.innerHTML = dailyForecast.map(day => {
        const date = new Date(day.dt * 1000);
        const options = { weekday: 'long', day: 'numeric', month: 'long' };
        return `
            <div class="forecast-day">
                <p><strong>${date.toLocaleDateString('pl-PL', options)}</strong></p>
                <p>${day.weather[0].description}</p>
                <p>Temperatura: ${day.main.temp}°C</p>
                <p>Maks: ${day.main.temp_max}°C, Min: ${day.main.temp_min}°C</p>
                <p>Wilgotność: ${day.main.humidity}%</p>
                <p>Prędkość wiatru: ${day.wind.speed} m/s</p>
                <p>Ciśnienie: ${day.main.pressure} hPa</p>
            </div>
        `;
    }).join('');
}

// Obsługa błędów geolokalizacji
function showError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            currentWeatherElement.textContent = 'Nie zezwolono na dostęp do lokalizacji.';
            break;
        case error.POSITION_UNAVAILABLE:
            currentWeatherElement.textContent = 'Informacje o lokalizacji niedostępne.';
            break;
        case error.TIMEOUT:
            currentWeatherElement.textContent = 'Przekroczono czas oczekiwania na lokalizację.';
            break;
        default:
            currentWeatherElement.textContent = 'Wystąpił nieznany błąd.';
            break;
    }
}

// Inicjalizacja
getLocation();
