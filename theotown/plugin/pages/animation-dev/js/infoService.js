const hintBar = document.getElementById("hint");
const originInfoBar = document.getElementById("originInfo");
const animationPosInfoBar = document.getElementById("animationPosInfo");

function hint(msg) {
    hintBar.innerHTML = msg;
}

function updateInfo() {
    originInfoBar.innerHTML = `<b>${Strings.ORIGIN_STR}:</b>&emsp;X: ${origin.x}, Y: ${origin.y}`;
    if (animationData[0]) {
        // Load animation list information
        let animationListInfo = "";
        for (let j = 0; j < animationData.length; j++) {
            let result = `<button class="button-small" onclick="animationIndex = ${j}; hint(\`${Strings.ANIMATION_STR}: ${j}\`);">${Strings.BUTTON_SWITCH_ANIMATION}</button>&emsp;${Strings.ANIMATION_STR}(${j}): ${animationData[j].name}, x: ${animationData[j].x}, y: ${animationData[j].y}, handle x: ${-animationData[j].x}, handle y: ${-animationData[j].y}<br>`
            animationListInfo += result;
        }
        document.getElementById("animationList").innerHTML = animationListInfo;

    }


}