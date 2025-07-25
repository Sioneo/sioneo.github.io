function changeDisplayStyle(){
  if (localStorage.getItem("style") == null) {
    localStorage.setItem("style", 0)
  }
  const button = document.getElementById("changeDisplayStyleButton");

  // 获取根元素（或任何包含CSS变量的元素）
  const root = document.documentElement;

  if (localStorage.getItem("style") == 0){
    button.innerHTML = "日间模式";
    localStorage.setItem("style", 1);


    root.style.setProperty('--bgColor', 'rgba(20, 20, 20, 1)');
    root.style.setProperty('--boxBgColor', 'rgba(140, 140, 140, 0.12)');
    root.style.setProperty('--textColor', 'rgba(200, 200, 200, 1)');
    root.style.setProperty('--headBoxColor', 'rgba(0, 100, 111, 1)');
    root.style.setProperty('--headTextColor', 'rgba(237, 242, 242, 1)');
    root.style.setProperty('--hrColor', '#808080');

  }
  else if (localStorage.getItem("style") == 1) {
    button.innerHTML = "夜间模式";
    localStorage.setItem("style", 0)

    root.style.setProperty('--bgColor', 'rgba(237, 242, 242, 1)');
    root.style.setProperty('--boxBgColor', 'rgba(170, 170, 170, 0.12)');
    root.style.setProperty('--textColor', 'black');
    root.style.setProperty('--headBoxColor', '#009ca7');
    root.style.setProperty('--headTextColor', 'white');
    root.style.setProperty('--hrColor', '#b3b3b3');
  }
}