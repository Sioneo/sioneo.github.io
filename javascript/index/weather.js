const locationText = document.getElementById("weather-location");
const weatherInfo = document.getElementById("weather-info");

function getWeatherState(code) {
    const weatherMap = {
        0: "☀️万里无云",           // Clear sky
        1: "🌤️晴",             // Mainly clear
        2: "⛅️多云",       // Partly cloudy
        3: "☁️阴",           // Overcast
        45: "🌫️雾",            // Fog
        48: "🌫️积霜雾",
        51: "🌦️毛毛细雨",        // Drizzle
        53: "🌦️毛毛细雨",        // Drizzle
        55: "🌦️毛毛细雨",        // Drizzle
        56: "🌧️冻雨",
        57: "🌧️冻雨",
        61: "☔️小雨",          // Rain
        63: "🌧️中雨",          // Rain
        65: "🌧️大雨",          // Rain
        71: "🌨️小雪",          // Snow
        73: "🌨️中雪",          // Snow
        75: "❄️大雪",          // Snow
        80: "🌦️阵雨",          // Showers
        81: "🌦️阵雨",          // Showers
        82: "🌦️阵雨",          // Showers
        95: "⚡雷雨",
        96: "⛈️雷暴",
        99: "⛈️雷暴"
    };
    return weatherMap[code] || "未知";
}

function getTemperatureIcon(temp) {
    let result;
    if (temp >= 34) { result = "💥" }
    else if (temp >= 30) { result = "🥵" }
    else if (temp >= 26) { result = "😥" }
    else if (temp >= 20) { result = "😉" }
    else if (temp >= 14) { result = "🤧" }
    else { result = "🥶" }

    return result;
}

function getWindGrade(v) {
        // 处理无效输入
    if (typeof v !== 'number' || isNaN(v) || v < 0) {
        return null;
    }

    // 风力等级区间 [下限, 上限) 特殊处理17级和0级
    const grades = [
        { grade: 0, min: 0, max: 0.2 },        // 0级 0-0.2
        { grade: 1, min: 0.3, max: 1.5 },
        { grade: 2, min: 1.6, max: 3.3 },
        { grade: 3, min: 3.4, max: 5.4 },
        { grade: 4, min: 5.5, max: 7.9 },
        { grade: 5, min: 8.0, max: 10.7},
        { grade: 6, min: 10.8, max: 13.8 },
        { grade: 7, min: 13.9, max: 17.1 },
        { grade: 8, min: 17.2, max: 20.7 },
        { grade: 9, min: 20.8, max: 24.4 },
        { grade: 10, min: 24.5, max: 28.4 },
        { grade: 11, min: 28.5, max: 32.6 },
        { grade: 12, min: 32.7, max: 36.9 },
        { grade: 13, min: 37.0, max: 41.4 },
        { grade: 14, min: 41.5, max: 46.1 },
        { grade: 15, min: 46.2, max: 50.9 },
        { grade: 16, min: 51.0, max: 56.0 },
        { grade: 17, min: 56.1, max: Infinity }  // 17级及以上
    ];

    for (const g of grades) {
        if (v >= g.min && v <= g.max) return g.grade;
    }
    
}

function getWindIcon(v) {
    const level = getWindGrade(v);
    if (level >= 7) {
        return "🌪️"
    } else if (level <= 6) {
        return "💨"
    }
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
        current.windspeed /= 3.6;
        locationText.innerHTML = `<div class="flex wrap"><span><i class="w">U</i>广东 江门</span><span>${lat}°N, ${lon}°E</span></div>`;
        weatherInfo.innerHTML = `
        <div class="flex align-center wrap"><h4 class="inline">${getWeatherState(current.weathercode)}</h4><span>${getTemperatureIcon(current.temperature)} ${current.temperature}°C</span></div>
        <div class="flex wrap"><span>💨 ${(current.windspeed).toFixed(2)} m/s at ${current.winddirection}° (${getWindGrade(current.windspeed)}级)</span><span>${current.is_day == 0 ? "🌙 晚上" : "☀️ 早上"}</span></div>
        `;
    } else {
        weatherInfo.innerText = "无法获取天气数据";
    }
}

refreshWeather();
