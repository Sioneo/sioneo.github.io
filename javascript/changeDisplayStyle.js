const button = document.getElementById("changeDisplayStyleButton"); //获取按钮

// Cookie 操作工具函数
function getCookie(name) {
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    const [key, value] = cookie.trim().split('=');
    if (key === name) return decodeURIComponent(value);
  }
  return null;
}

function setCookie(name, value, days = 365) {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${date.toUTCString()};path=/`;
}

// 主题切换主函数
function changeDisplayStyle() {
  // 读取当前模式，如果没有设置则根据系统主题初始化
  let currentStyle = getCookie("theme_style");
  
  // 如果未手动设置过，则检测系统主题
  if (currentStyle == null) {
    const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    currentStyle = isSystemDark ? "night" : "day";
    setCookie("theme_style", currentStyle);
  }
  const root = document.documentElement;

  if (currentStyle === "night") {
    // 当前是夜间模式，切换到日间模式
    button.textContent = "日间模式";
    setCookie("theme_style", "day");

    // 日间模式样式
    root.style.setProperty('--bgColor', 'rgba(237, 242, 242, 1)');
    root.style.setProperty('--boxBgColor', 'rgba(170, 170, 170, 0.12)');
    root.style.setProperty('--textColor', 'black');
    root.style.setProperty('--headBoxColor', '#009ca7');
    root.style.setProperty('--headTextColor', 'white');
    root.style.setProperty('--hrColor', '#b3b3b3');
  } else {
    // 当前是日间模式，切换到夜间模式
    button.textContent = "夜间模式";
    setCookie("theme_style", "night");

    // 夜间模式样式
    root.style.setProperty('--bgColor', 'rgba(20, 20, 20, 1)');
    root.style.setProperty('--boxBgColor', 'rgba(140, 140, 140, 0.12)');
    root.style.setProperty('--textColor', 'rgba(200, 200, 200, 1)');
    root.style.setProperty('--headBoxColor', 'rgba(0, 100, 111, 1)');
    root.style.setProperty('--headTextColor', 'rgba(237, 242, 242, 1)');
    root.style.setProperty('--hrColor', '#808080');
  }
}

var currentMode;
// 初始化检测，自动设置日间/夜间模式
if (button.innerText == "夜间模式") {
  currentMode = "day";
} else {
  currentMode = "night";
}

if (currentMode != getCookie("theme_style")) {
  changeDisplayStyle();
}

// 监听系统主题变化（可选：如果用户切换系统主题，自动更新页面）
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  if (getCookie("theme_style") == null) { // 仅当未手动设置过时响应
    changeDisplayStyle();
  }
});