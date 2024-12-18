const apiKey = 9bfa99fffea4f23e3e01be8849025063025063;  // Wstaw swój klucz API

// Funkcja do pobrania pogody na podstawie współrzędnych
async function getWeather(latitude, longitude) {
    try {
        // Pobranie aktualnej pogody
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric&lang=pl`);
        
        if (!response.ok) {
            throw new Error(`Błąd odpowiedzi: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.cod === 200) {
            const location = `${data.name}, ${data.sys.country}`;
            const temperature = `${data.main.temp}°C`;
            const description = data.weather[0].description;

            // Wyświetlanie danych aktualnych
            document.getElementById("location").textContent = `Lokalizacja: ${location}`;
            document.getElementById("temperature").textContent = `Temperatura: ${temperature}`;
            document.getElementById("description").textContent = `Opis: ${description}`;

            // Pobierz prognozę na 6 dni
            await getForecast(latitude, longitude);
        } else {
            document.getElementById("error").textContent = `Błąd API: ${data.message}`;
        }
    } catch (error) {
        console.error(error);
        document.getElementById("error").textContent = `Błąd połączenia z serwisem pogodowym: ${error.message}`;
    }
}

// Funkcja do pobrania prognozy na 6 dni
async function getForecast(latitude, longitude) {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric&lang=pl`);
    
    const data = await response.json();

    if (data.cod === "200") {
        let forecastHTML = '';
        for (let i = 1; i <= 6; i++) {
            const day = data.list[i * 8];  // Zbieramy prognozę na 12:00 każdego dnia (8 punktów co 3 godziny)
            forecastHTML += `
                <div class="weather-day">
                    <p>Dzień ${i}: ${day.main.temp}°C, ${day.weather[0].description}</p>
                </div>
            `;
        }
        document.getElementById("forecast").innerHTML = forecastHTML;
    } else {
        document.getElementById("error").textContent = "Nie udało się pobrać prognozy.";
    }
}

// Funkcja do uzyskania lokalizacji użytkownika
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            getWeather(latitude, longitude);  // Pobranie pogody na podstawie lokalizacji
        }, (error) => {
            document.getElementById("error").textContent = "Nie udało się wykryć lokalizacji.";
        });
    } else {
        document.getElementById("error").textContent = "Geolokalizacja nie jest wspierana przez tę przeglądarkę.";
    }
}

// Wywołanie funkcji pobierającej lokalizację po załadowaniu strony
window.onload = getLocation;
