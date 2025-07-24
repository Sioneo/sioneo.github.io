function changeDisplayStyle(){
  if (localStorage.getItem("style") == null) {
    localStorage.setItem("style", 0)
  }
  const button = document.getElementById("changeDisplayStyleButton");

  // 获取根元素（或任何包含CSS变量的元素）
  const root = document.documentElement;

  if (localStorage.getItem("style") == 0){
    button.innerHTML = "日间模式";
    localStorage.setItem("style", 1)

    root.style.setProperty('--bgColor', rgba(20, 20, 20, 1));
    root.style.setProperty('--headTextColor', 'black');
    root.style.setProperty('--textColor', 'white');
  }
  else if (localStorage.getItem("style") == 1) {
    button.innerHTML = "夜间模式";
    localStorage.setItem("style", 0)
  }
}