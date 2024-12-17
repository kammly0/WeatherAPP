// Twój klucz API z OpenWeatherMap
const apiKey = "9bfa99fffea4f23e3e01be8849025063"; 

// Funkcja do pobrania pogody na podstawie współrzędnych
async function getWeather(latitude, longitude) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric&lang=pl`);
        
        // Sprawdzenie statusu odpowiedzi
        if (!response.ok) {
            throw new Error(`Błąd odpowiedzi: ${response.status}`);
        }

        const data = await response.json();

        // Sprawdzanie, czy odpowiedź zawiera dane o pogodzie
        console.log(data); // Dodaj logowanie odpowiedzi do konsoli
        if (data.cod === 200) {
            const location = `${data.name}, ${data.sys.country}`;
            const temperature = `${data.main.temp}°C`;
            const description = data.weather[0].description;

            // Wyświetlanie danych
            document.getElementById("location").textContent = `Lokalizacja: ${location}`;
            document.getElementById("temperature").textContent = `Temperatura: ${temperature}`;
            document.getElementById("description").textContent = `Opis: ${description}`;
        } else {
            document.getElementById("error").textContent = `Błąd API: ${data.message}`;
        }
    } catch (error) {
        console.error(error); // Logowanie błędu w konsoli
        document.getElementById("error").textContent = `Błąd połączenia z serwisem pogodowym: ${error.message}`;
    }
}

// Funkcja do uzyskania lokalizacji użytkownika
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            getWeather(latitude, longitude); // Pobranie pogody na podstawie lokalizacji
        }, (error) => {
            document.getElementById("error").textContent = "Nie udało się wykryć lokalizacji.";
        });
    } else {
        document.getElementById("error").textContent = "Geolokalizacja nie jest wspierana przez tę przeglądarkę.";
    }
}

// Wywołanie funkcji pobierającej lokalizację po załadowaniu strony
window.onload = getLocation;
