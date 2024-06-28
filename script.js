// Weather API configuration
const weatherApi = {
    key: '4eb3703790b356562054106543b748b2',
    baseUrl: 'https://api.openweathermap.org/data/2.5/weather'
};

// Event listener for Enter key press in the search input box
document.getElementById('input-box').addEventListener('keypress', (event) => {
    if (event.keyCode === 13) {
        getWeatherReport(event.target.value);
    }
});

// Function to fetch weather report
function getWeatherReport(city) {
    fetch(`${weatherApi.baseUrl}?q=${city}&appid=${weatherApi.key}&units=metric`)
        .then(response => {
            if (!response.ok) {
                if (response.status === 400) {
                    showAlert("Empty Input", "Please enter a city", "error");
                } else if (response.status === 404) {
                    showAlert("Bad Input", "Entered city not found", "warning");
                }
                throw new Error(response.statusText);
            }
            return response.json();
        })
        .then(showWeatherReport)
        .catch(error => console.error('Error fetching weather data:', error));
}

// Function to show weather report
function showWeatherReport(weather) {
    const weatherBody = document.getElementById('weather-body');
    const todayDate = new Date();
    
    weatherBody.innerHTML = `
        <div class="location-details">
            <div class="city">${weather.name}, ${weather.sys.country}</div>
            <div class="date">${formatDate(todayDate)}</div>
        </div>
        <div class="weather-status">
            <div class="temp">${Math.round(weather.main.temp)}&deg;C</div>
            <div class="weather">${weather.weather[0].main} <i class="${getIconClass(weather.weather[0].main)}"></i></div>
            <div class="min-max">${Math.floor(weather.main.temp_min)}&deg;C (min) / ${Math.ceil(weather.main.temp_max)}&deg;C (max)</div>
            <div>Updated as of ${formatTime(todayDate)}</div>
        </div>
        <hr>
        <div class="day-details">
            <div class="basic">Feels like ${weather.main.feels_like}&deg;C | Humidity ${weather.main.humidity}%<br>Pressure ${weather.main.pressure} mb | Wind ${weather.wind.speed} KMPH</div>
        </div>
    `;
    
    weatherBody.style.display = 'block';
    changeBackground(weather.weather[0].main);
    resetInput();
}

// Function to format the date
function formatDate(date) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    return `${date.getDate()} ${months[date.getMonth()]} (${days[date.getDay()]}) , ${date.getFullYear()}`;
}

// Function to format the time
function formatTime(date) {
    const hours = addZero(date.getHours());
    const minutes = addZero(date.getMinutes());
    return `${hours}:${minutes}`;
}

// Function to change the background based on weather status
function changeBackground(status) {
    const backgrounds = {
        'Clouds': 'url(clouds.jpg)',
        'Rain': 'url(rainy.jpg)',
        'Clear': 'url(clear.jpg)',
        'Snow': 'url(snow.jpg)',
        'Sunny': 'url(sunny.jpg)',
        'Thunderstorm': 'url(thunderstorm.jpg)',
        'Drizzle': 'url(drizzle.jpg)',
        'Mist': 'url(mist.jpg)',
        'Haze': 'url(mist.jpg)',
        'Fog': 'url(mist.jpg)'
    };
    document.body.style.backgroundImage = backgrounds[status] || 'url(bg.jpg)';
}

// Function to get the icon class based on weather status
function getIconClass(status) {
    const icons = {
        'Rain': 'fas fa-cloud-showers-heavy',
        'Clouds': 'fas fa-cloud',
        'Clear': 'fas fa-cloud-sun',
        'Snow': 'fas fa-snowman',
        'Sunny': 'fas fa-sun',
        'Mist': 'fas fa-smog',
        'Thunderstorm': 'fas fa-thunderstorm',
        'Drizzle': 'fas fa-cloud-rain'
    };
    return icons[status] || 'fas fa-cloud-sun';
}

// Function to show alerts using SweetAlert
function showAlert(title, text, icon) {
    swal(title, text, icon);
    resetInput();
}

// Function to reset the input field
function resetInput() {
    document.getElementById('input-box').value = '';
}

// Function to add leading zero to time components if less than 10
function addZero(num) {
    return num < 10 ? '0' + num : num;
}
