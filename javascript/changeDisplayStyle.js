function changeDisplayStyle() {
  // 读取当前模式，如果没有设置则根据系统主题初始化
  let currentStyle = localStorage.getItem("style");
  
  // 如果未手动设置过，则检测系统主题
  if (currentStyle == null) {
    const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    currentStyle = isSystemDark ? 0 : 1; // 0=夜间模式，1=日间模式
    localStorage.setItem("style", currentStyle);
  }

  const button = document.getElementById("changeDisplayStyleButton");
  const root = document.documentElement;

  if (parseInt(currentStyle) === 0) {
    // 切换到日间模式（按钮显示“日间模式”）
    button.innerHTML = "日间模式";
    localStorage.setItem("style", 1);

    root.style.setProperty('--bgColor', 'rgba(20, 20, 20, 1)');
    root.style.setProperty('--boxBgColor', 'rgba(140, 140, 140, 0.12)');
    root.style.setProperty('--textColor', 'rgba(200, 200, 200, 1)');
    root.style.setProperty('--headBoxColor', 'rgba(0, 100, 111, 1)');
    root.style.setProperty('--headTextColor', 'rgba(237, 242, 242, 1)');
    root.style.setProperty('--hrColor', '#808080');
  } else {
    // 切换回夜间模式（按钮显示“夜间模式”）
    button.innerHTML = "夜间模式";
    localStorage.setItem("style", 0);

    root.style.setProperty('--bgColor', 'rgba(237, 242, 242, 1)');
    root.style.setProperty('--boxBgColor', 'rgba(170, 170, 170, 0.12)');
    root.style.setProperty('--textColor', 'black');
    root.style.setProperty('--headBoxColor', '#009ca7');
    root.style.setProperty('--headTextColor', 'white');
    root.style.setProperty('--hrColor', '#b3b3b3');
  }
}

// 初始化时检测系统主题并设置样式
changeDisplayStyle();

// 监听系统主题变化（可选：如果用户切换系统主题，自动更新页面）
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  if (localStorage.getItem("style") == null) { // 仅当未手动设置过时响应
    changeDisplayStyle();
  }
});