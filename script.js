const apiKey = '9bfa99fffea4f23e3e01be8849025063';
const currentWeatherElement = document.getElementById('current-weather');
const forecastElement = document.getElementById('forecast');
const airQualityElement = document.getElementById('air-quality');
const mapContainer = document.getElementById('map');
const layerSelect = document.getElementById('layer-select');

// Funkcja do pobrania pogody na podstawie nazwy miasta
async function fetchWeatherByCity(city) {
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=pl&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&lang=pl&appid=${apiKey}`;
    const airQualityUrl = `https://api.openweathermap.org/data/2.5/air_pollution?q=${city}&appid=${apiKey}`;

    try {
        const [weatherResponse, forecastResponse, airQualityResponse] = await Promise.all([
            fetch(weatherUrl),
            fetch(forecastUrl),
            fetch(airQualityUrl)
        ]);

        const weatherData = await weatherResponse.json();
        const forecastData = await forecastResponse.json();
        const airQualityData = await airQualityResponse.json();

        displayCurrentWeather(weatherData);
        displayForecast(forecastData);
        displayAirQuality(airQualityData);
    } catch (error) {
        currentWeatherElement.textContent = 'Nie udało się pobrać danych pogodowych.';
    }
}

// Wyświetlanie aktualnej pogody
function displayCurrentWeather(data) {
    const { main, weather, wind, name } = data;
    currentWeatherElement.innerHTML = `
        <h2>Pogoda w ${name}</h2>
        <p>${weather[0].description}</p>
        <p>Temperatura: ${main.temp}°C</p>
        <p>Wilgotność: ${main.humidity}%</p>
        <p>Prędkość wiatru: ${wind.speed} m/s</p>
    `;
}

// Wyświetlanie prognozy
function displayForecast(data) {
    const dailyForecast = data.list.filter(item => item.dt_txt.includes('12:00:00')).slice(0, 5);
    forecastElement.innerHTML = dailyForecast.map(day => {
        const date = new Date(day.dt * 1000);
        return `
            <div class="forecast-day">
                <p><strong>${date.toLocaleDateString('pl-PL')}</strong></p>
                <p>${day.weather[0].description}</p>
                <p>Temp: ${day.main.temp}°C</p>
            </div>
        `;
    }).join('');
}

// Wyświetlanie zanieczyszczenia powietrza
function displayAirQuality(data) {
    const { list } = data;
    if (list && list.length > 0) {
        const aqi = list[0].main.aqi;
        const aqiDescription = ['Bardzo dobry', 'Dobry', 'Umiarkowany', 'Zły', 'Bardzo zły'];
        airQualityElement.innerHTML = `
            <h3>Jakość powietrza</h3>
            <p>Indeks jakości powietrza (AQI): ${aqi} (${aqiDescription[aqi - 1]})</p>
        `;
    } else {
        airQualityElement.textContent = 'Nie udało się pobrać danych o jakości powietrza.';
    }
}

// Inicjalizacja mapy pogodowej
function initWeatherMap() {
    const map = L.map('map').setView([52.2297, 21.0122], 6); // Domyślnie: Warszawa, Polska
    const layer = L.tileLayer(`https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${apiKey}`, {
        attribution: '&copy; <a href="https://openweathermap.org/">OpenWeatherMap</a>'
    }).addTo(map);

    layerSelect.addEventListener('change', () => {
        const selectedLayer = layerSelect.value;
        map.eachLayer(layer => map.removeLayer(layer));
        L.tileLayer(`https://tile.openweathermap.org/map/${selectedLayer}/{z}/{x}/{y}.png?appid=${apiKey}`, {
            attribution: '&copy; <a href="https://openweathermap.org/">OpenWeatherMap</a>'
        }).addTo(map);
    });
}

// Obsługa wyszukiwania
document.getElementById('search-btn').addEventListener('click', () => {
    const city = document.getElementById('city-input').value;
    if (city) {
        fetchWeatherByCity(city);
    }
});

// Inicjalizacja
initWeatherMap();
