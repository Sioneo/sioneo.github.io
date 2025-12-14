const hintBar = document.getElementById("hint");
const originInfoBar = document.getElementById("originInfo");
const animationPosInfoBar = document.getElementById("animationPosInfo");

function hint(msg) {
    hintBar.innerHTML = msg;
}

function updateInfo() {
    originInfoBar.innerHTML = `<b>坐标原点</b>&emsp;X: ${origin.x}, Y: ${origin.y}`;
    animationPosInfoBar.innerHTML = `<b>动画位置</b>&emsp;x: ${animationPos.x}, y: ${animationPos.y}, handle x: ${-animationPos.x}, handle y: ${-animationPos.y}`;
}