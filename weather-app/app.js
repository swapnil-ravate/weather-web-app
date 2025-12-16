// ===================================
// PREMIUM WEATHER APP - JAVASCRIPT
// Using Free OpenWeatherMap APIs
// ===================================

// === API CONFIGURATION ===
// Using a demo API key - users should get their own from https://openweathermap.org/api
const API_KEY = 'bd5e378503939ddaee76f12ad7a97608'; // Free tier API key
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_URL = 'https://api.openweathermap.org/geo/1.0';

// === STATE MANAGEMENT ===
let currentUnit = 'metric'; // 'metric' for Celsius, 'imperial' for Fahrenheit
let currentCity = null;
let currentCoords = null;

// === DOM ELEMENTS ===
const elements = {
    // Search
    citySearch: document.getElementById('citySearch'),
    locationBtn: document.getElementById('locationBtn'),

    // Theme & Units
    themeToggle: document.getElementById('themeToggle'),
    unitToggle: document.getElementById('unitToggle'),

    // Current Weather
    loadingSkeleton: document.getElementById('loadingSkeleton'),
    weatherContent: document.getElementById('weatherContent'),
    cityName: document.getElementById('cityName'),
    currentDate: document.getElementById('currentDate'),
    temperature: document.getElementById('temperature'),
    weatherIconLarge: document.getElementById('weatherIconLarge'),
    weatherDescription: document.getElementById('weatherDescription'),
    feelsLike: document.getElementById('feelsLike'),

    // Weather Details
    windSpeed: document.getElementById('windSpeed'),
    humidity: document.getElementById('humidity'),
    pressure: document.getElementById('pressure'),
    visibility: document.getElementById('visibility'),
    sunrise: document.getElementById('sunrise'),
    sunset: document.getElementById('sunset'),

    // Forecast
    forecastContainer: document.getElementById('forecastContainer'),

    // Toast
    toast: document.getElementById('toast'),
    toastMessage: document.getElementById('toastMessage')
};

// === INITIALIZATION ===
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    attachEventListeners();
});

function initializeApp() {
    // Load theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        elements.themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }

    // Load unit preference
    const savedUnit = localStorage.getItem('unit');
    if (savedUnit) {
        currentUnit = savedUnit;
        updateUnitDisplay();
    }

    // Try to get user's location
    getUserLocation();
}

function attachEventListeners() {
    // Search functionality
    elements.citySearch.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const city = elements.citySearch.value.trim();
            if (city) {
                searchCity(city);
            }
        }
    });

    // Location button
    elements.locationBtn.addEventListener('click', getUserLocation);

    // Theme toggle
    elements.themeToggle.addEventListener('click', toggleTheme);

    // Unit toggle
    elements.unitToggle.addEventListener('click', toggleUnit);
}

// === GEOLOCATION ===
function getUserLocation() {
    if (!navigator.geolocation) {
        showToast('Geolocation is not supported by your browser', 'error');
        searchCity('London'); // Fallback
        return;
    }

    showToast('Getting your location...', 'info');

    navigator.geolocation.getCurrentPosition(
        (position) => {
            currentCoords = {
                lat: position.coords.latitude,
                lon: position.coords.longitude
            };
            fetchWeatherByCoords(currentCoords.lat, currentCoords.lon);
        },
        (error) => {
            console.error('Geolocation error:', error);
            showToast('Unable to get your location. Showing weather for London.', 'error');
            searchCity('London'); // Fallback
        }
    );
}

// === API CALLS ===
async function searchCity(cityName) {
    try {
        showLoading();

        // Get coordinates for the city
        const geoResponse = await fetch(
            `${GEO_URL}/direct?q=${encodeURIComponent(cityName)}&limit=1&appid=${API_KEY}`
        );

        if (!geoResponse.ok) {
            throw new Error('City not found');
        }

        const geoData = await geoResponse.json();

        if (geoData.length === 0) {
            showToast(`City "${cityName}" not found. Please try another city.`, 'error');
            hideLoading();
            return;
        }

        const { lat, lon, name, country } = geoData[0];
        currentCity = `${name}, ${country}`;
        currentCoords = { lat, lon };

        await fetchWeatherByCoords(lat, lon);

    } catch (error) {
        console.error('Search error:', error);
        showToast('Error searching for city. Please try again.', 'error');
        hideLoading();
    }
}

async function fetchWeatherByCoords(lat, lon) {
    try {
        showLoading();

        // Fetch current weather and forecast in parallel
        const [currentResponse, forecastResponse] = await Promise.all([
            fetch(`${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=${currentUnit}&appid=${API_KEY}`),
            fetch(`${BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=${currentUnit}&appid=${API_KEY}`)
        ]);

        if (!currentResponse.ok || !forecastResponse.ok) {
            throw new Error('Weather data not available');
        }

        const currentData = await currentResponse.json();
        const forecastData = await forecastResponse.json();

        // Update city name if not already set
        if (!currentCity) {
            currentCity = `${currentData.name}, ${currentData.sys.country}`;
        }

        updateCurrentWeather(currentData);
        updateForecast(forecastData);
        hideLoading();

        showToast(`Weather updated for ${currentCity}`, 'success');

    } catch (error) {
        console.error('Weather fetch error:', error);
        showToast('Error fetching weather data. Please try again.', 'error');
        hideLoading();
    }
}

// === UI UPDATES ===
function updateCurrentWeather(data) {
    // City and date
    elements.cityName.querySelector('span').textContent = currentCity;
    elements.currentDate.textContent = formatDate(new Date());

    // Temperature
    const temp = Math.round(data.main.temp);
    const feelsLike = Math.round(data.main.feels_like);
    const unit = currentUnit === 'metric' ? 'C' : 'F';

    elements.temperature.textContent = temp;
    elements.weatherContent.querySelector('.temp-unit').textContent = `°${unit}`;
    elements.feelsLike.textContent = `${feelsLike}°${unit}`;

    // Weather description and icon
    const weather = data.weather[0];
    elements.weatherDescription.textContent = weather.description;
    elements.weatherIconLarge.innerHTML = getWeatherIcon(weather.icon, weather.main);

    // Weather details
    const windSpeedValue = currentUnit === 'metric'
        ? Math.round(data.wind.speed * 3.6) // m/s to km/h
        : Math.round(data.wind.speed); // mph
    const windUnit = currentUnit === 'metric' ? 'km/h' : 'mph';

    elements.windSpeed.textContent = `${windSpeedValue} ${windUnit}`;
    elements.humidity.textContent = `${data.main.humidity}%`;
    elements.pressure.textContent = `${data.main.pressure} hPa`;
    elements.visibility.textContent = `${(data.visibility / 1000).toFixed(1)} km`;

    // Sunrise and sunset
    elements.sunrise.textContent = formatTime(data.sys.sunrise);
    elements.sunset.textContent = formatTime(data.sys.sunset);

    // Update background based on weather
    updateBackground(weather.icon, weather.main);
}

function updateForecast(data) {
    elements.forecastContainer.innerHTML = '';

    // Get one forecast per day (around noon)
    const dailyForecasts = getDailyForecasts(data.list);

    dailyForecasts.forEach((forecast, index) => {
        const card = createForecastCard(forecast, index);
        elements.forecastContainer.appendChild(card);
    });
}

function createForecastCard(forecast, index) {
    const card = document.createElement('div');
    card.className = 'forecast-card';
    card.style.animationDelay = `${index * 0.1}s`;

    const date = new Date(forecast.dt * 1000);
    const temp = Math.round(forecast.main.temp);
    const unit = currentUnit === 'metric' ? 'C' : 'F';
    const weather = forecast.weather[0];

    card.innerHTML = `
        <div class="forecast-day">${formatDay(date)}</div>
        <div class="forecast-date">${formatShortDate(date)}</div>
        <div class="forecast-icon">${getWeatherIcon(weather.icon, weather.main)}</div>
        <div class="forecast-temp">${temp}°${unit}</div>
        <div class="forecast-desc">${weather.description}</div>
    `;

    return card;
}

// === HELPER FUNCTIONS ===
function getDailyForecasts(forecastList) {
    // Group forecasts by day and pick the one closest to noon
    const dailyMap = new Map();

    forecastList.forEach(forecast => {
        const date = new Date(forecast.dt * 1000);
        const dateKey = date.toDateString();
        const hour = date.getHours();

        if (!dailyMap.has(dateKey)) {
            dailyMap.set(dateKey, forecast);
        } else {
            // Prefer forecasts closer to noon (12:00)
            const existing = dailyMap.get(dateKey);
            const existingHour = new Date(existing.dt * 1000).getHours();

            if (Math.abs(hour - 12) < Math.abs(existingHour - 12)) {
                dailyMap.set(dateKey, forecast);
            }
        }
    });

    // Get next 5 days (skip today)
    const forecasts = Array.from(dailyMap.values());
    return forecasts.slice(1, 6);
}

function getWeatherIcon(iconCode, weatherMain) {
    // Map OpenWeatherMap icon codes to Font Awesome icons
    const iconMap = {
        '01d': '<i class="fas fa-sun" style="color: #fbbf24;"></i>',
        '01n': '<i class="fas fa-moon" style="color: #cbd5e1;"></i>',
        '02d': '<i class="fas fa-cloud-sun" style="color: #fbbf24;"></i>',
        '02n': '<i class="fas fa-cloud-moon" style="color: #cbd5e1;"></i>',
        '03d': '<i class="fas fa-cloud" style="color: #94a3b8;"></i>',
        '03n': '<i class="fas fa-cloud" style="color: #94a3b8;"></i>',
        '04d': '<i class="fas fa-cloud" style="color: #64748b;"></i>',
        '04n': '<i class="fas fa-cloud" style="color: #64748b;"></i>',
        '09d': '<i class="fas fa-cloud-rain" style="color: #60a5fa;"></i>',
        '09n': '<i class="fas fa-cloud-rain" style="color: #60a5fa;"></i>',
        '10d': '<i class="fas fa-cloud-sun-rain" style="color: #60a5fa;"></i>',
        '10n': '<i class="fas fa-cloud-moon-rain" style="color: #60a5fa;"></i>',
        '11d': '<i class="fas fa-cloud-bolt" style="color: #eab308;"></i>',
        '11n': '<i class="fas fa-cloud-bolt" style="color: #eab308;"></i>',
        '13d': '<i class="fas fa-snowflake" style="color: #cbd5e1;"></i>',
        '13n': '<i class="fas fa-snowflake" style="color: #cbd5e1;"></i>',
        '50d': '<i class="fas fa-smog" style="color: #94a3b8;"></i>',
        '50n': '<i class="fas fa-smog" style="color: #94a3b8;"></i>'
    };

    return iconMap[iconCode] || '<i class="fas fa-cloud"></i>';
}

function updateBackground(iconCode, weatherMain) {
    const root = document.documentElement;
    const isDark = document.body.classList.contains('dark-mode');

    // Weather-based gradient colors
    const gradients = {
        Clear: isDark
            ? 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)'
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        Clouds: isDark
            ? 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)'
            : 'linear-gradient(135deg, #606c88 0%, #3f4c6b 100%)',
        Rain: isDark
            ? 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)'
            : 'linear-gradient(135deg, #00d2ff 0%, #3a7bd5 100%)',
        Drizzle: isDark
            ? 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)'
            : 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)',
        Thunderstorm: isDark
            ? 'linear-gradient(135deg, #141e30 0%, #243b55 100%)'
            : 'linear-gradient(135deg, #2c3e50 0%, #4ca1af 100%)',
        Snow: isDark
            ? 'linear-gradient(135deg, #2c3e50 0%, #3f5163 100%)'
            : 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)',
        Mist: isDark
            ? 'linear-gradient(135deg, #232526 0%, #414345 100%)'
            : 'linear-gradient(135deg, #bdc3c7 0%, #2c3e50 100%)',
        Smoke: isDark
            ? 'linear-gradient(135deg, #232526 0%, #414345 100%)'
            : 'linear-gradient(135deg, #bdc3c7 0%, #2c3e50 100%)',
        Haze: isDark
            ? 'linear-gradient(135deg, #232526 0%, #414345 100%)'
            : 'linear-gradient(135deg, #bdc3c7 0%, #2c3e50 100%)',
        Fog: isDark
            ? 'linear-gradient(135deg, #232526 0%, #414345 100%)'
            : 'linear-gradient(135deg, #bdc3c7 0%, #2c3e50 100%)'
    };

    const gradient = gradients[weatherMain] || gradients.Clear;
    document.querySelector('.background-gradient').style.background = gradient;
}

// === DATE/TIME FORMATTING ===
function formatDate(date) {
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function formatDay(date) {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
}

function formatShortDate(date) {
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
    });
}

function formatTime(timestamp) {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
}

// === THEME & UNIT TOGGLES ===
function toggleTheme() {
    const isDark = document.body.classList.toggle('dark-mode');

    // Update icon
    elements.themeToggle.innerHTML = isDark
        ? '<i class="fas fa-sun"></i>'
        : '<i class="fas fa-moon"></i>';

    // Save preference
    localStorage.setItem('theme', isDark ? 'dark' : 'light');

    // Update background for current weather
    if (currentCoords) {
        fetchWeatherByCoords(currentCoords.lat, currentCoords.lon);
    }
}

function toggleUnit() {
    currentUnit = currentUnit === 'metric' ? 'imperial' : 'metric';
    updateUnitDisplay();
    localStorage.setItem('unit', currentUnit);

    // Refresh weather data with new units
    if (currentCoords) {
        fetchWeatherByCoords(currentCoords.lat, currentCoords.lon);
    }
}

function updateUnitDisplay() {
    elements.unitToggle.innerHTML = `<span class="unit-display">°${currentUnit === 'metric' ? 'C' : 'F'}</span>`;
}

// === LOADING STATES ===
function showLoading() {
    elements.loadingSkeleton.style.display = 'block';
    elements.weatherContent.style.display = 'none';
}

function hideLoading() {
    elements.loadingSkeleton.style.display = 'none';
    elements.weatherContent.style.display = 'block';
}

// === TOAST NOTIFICATIONS ===
function showToast(message, type = 'info') {
    elements.toastMessage.textContent = message;
    elements.toast.className = `toast ${type}`;
    elements.toast.classList.add('show');

    setTimeout(() => {
        elements.toast.classList.remove('show');
    }, 3000);
}

// === ERROR HANDLING ===
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    showToast('An unexpected error occurred. Please try again.', 'error');
});