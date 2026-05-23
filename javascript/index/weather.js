const locationText = document.getElementById("weather-location");
const weatherInfo = document.getElementById("weather-info");

function getWeatherState(code) {
    const weatherMap = {
        0: "☀️万里无云",           // Clear sky
        1: "🌤️晴",             // Mainly clear
        2: "⛅️多云",       // Partly cloudy
        3: "☁️阴",           // Overcast
        45: "🌫️雾",            // Fog
        51: "🌦️毛毛细雨",        // Drizzle
        53: "🌦️毛毛细雨",        // Drizzle
        55: "🌦️毛毛细雨",        // Drizzle
        61: "☔️小雨",          // Rain
        63: "🌧️中雨",          // Rain
        65: "🌧️大雨",          // Rain
        71: "🌨️小雪",          // Snow
        73: "🌨️中雪",          // Snow
        75: "❄️大雪",          // Snow
        80: "🌦️阵雨"           // Showers
    };
    return weatherMap[code] || "未知";
}

// 江门的经纬度：经度 113.08，纬度 22.58
const lat = 22.58;
const lon = 113.08;
const weatherApiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=auto&hourly=temperature_2m,relative_humidity_2m,windspeed_10m`;

async function getWeatherData() {
    try {
        const response = await fetch(weatherApiUrl);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("获取天气失败：", error);
        weatherInfo.innerText = `获取天气失败: ${error.message}`;
        return null;
    }
}

async function refreshWeather() {
    weatherInfo.innerText = "正在加载...";
    const data = await getWeatherData();

    if (data && data.current_weather) {
        const current = data.current_weather;
        locationText.innerHTML = `<div class="flex wrap"><span><i class="w">U</i>广东 江门</span><span>${lat}°N, ${lon}°E</span></div>`;
        weatherInfo.innerHTML = `
        <div class="flex align-center wrap"><h4 class="inline">${getWeatherState(current.weathercode)}</h4><span>🌡️ ${current.temperature}°C</span></div>
        <div class="flex wrap"><span>💨 ${current.windspeed} km/h at ${current.winddirection}°</span><span>${current.is_day == 0 ? "🌙 晚上": "☀️ 早上"}</span></div>
        `;
    } else {
        weatherInfo.innerText = "无法获取天气数据";
    }
}

refreshWeather();