/* main.js —— 动画开发工具页面接线
 * 页面负责：文案、按钮绑定、DOM 数据呈现
 * 核心计算与绘制全部交给 modules/module-animation-dev.js
 */
import { AnimationDev } from "../../../modules/module-animation-dev.js";
import { Keyboard } from "../../../../../web/modules/keyboard.js";
import { translations } from "./translation.js";
import { createAnimationDevKeymap } from "./keymap.js";

const strings = document.documentElement.lang.toLowerCase().startsWith("en")
    ? translations.EN
    : translations.ZH;

const hintBar = document.getElementById("hint");
const originInfoBar = document.getElementById("originInfo");
const animationListBar = document.getElementById("animationList");
const zoomFactorDisplayer = document.getElementById("zoomFactor");

const tool = new AnimationDev({
    mount: document.getElementById("canvasMount"),
    strings,
    onChange: renderData,
    onHint: renderHint,
    onError: () => alert(strings.ERROR_IMAGE_LOAD_FAILED),
});

const keyboard = new Keyboard(
    createAnimationDevKeymap({ tool, strings, hint: renderHint })
);

/* ============================================================
 * 数据呈现
 * ============================================================ */

function renderData(data) {
    originInfoBar.innerHTML = `<b>${strings.ORIGIN_STR}:</b>&emsp;X: ${data.origin.x}, Y: ${data.origin.y}`;
    zoomFactorDisplayer.innerText = data.zoom;
    renderAnimationList(data);
}

function renderHint(message) {
    hintBar.innerHTML = message;
}

function renderAnimationList(data) {
    animationListBar.textContent = "";
    data.animations.forEach((animation, index) => {
        const button = document.createElement("button");
        button.className = "button-small";
        button.dataset.animationIndex = index;
        button.innerHTML = strings.BUTTON_SWITCH_ANIMATION;

        const info = document.createElement("span");
        info.textContent = `\u2003${strings.ANIMATION_STR}(${index}): ${animation.name}, x: ${animation.x}, y: ${animation.y}, handle x: ${animation.handleX}, handle y: ${animation.handleY}`;

        animationListBar.append(button, info, document.createElement("br"));
    });
}

// 列表里的「切换动画」按钮用事件委托处理，不再依赖内联 onclick
animationListBar.addEventListener("click", (event) => {
    const button = event.target.closest("[data-animation-index]");
    if (button) tool.selectAnimation(Number(button.dataset.animationIndex));
});

/* ============================================================
 * 按钮与表单
 * ============================================================ */

document.getElementById("doneButton").addEventListener("click", handleDone);

async function handleDone() {
    const width = document.getElementById("buildingWidthInput").value;
    const height = document.getElementById("buildingHeightInput").value;
    if (!width || !height) {
        alert(strings.ERROR_NO_BUILDING_SIZE);
        return;
    }

    const animationFileInput = document.getElementById("animationFileInput");
    if (!animationFileInput.files[0]) {
        alert(strings.ERROR_NO_FILE_IMPORTED);
        return;
    }

    tool.setBuildingSize({
        width,
        height,
        handleX: document.getElementById("building-handle-x").value,
        handleY: document.getElementById("building-handle-y").value,
    });
    tool.clear();
    await tool.addBuilding(document.getElementById("buildingFileInput"));
    await tool.addAnimation(animationFileInput);
}

const ZOOM_BUTTONS = [
    ["zoomInButton0.5", 0.5],
    ["zoomInButton0.1", 0.1],
    ["zoomOutButton0.1", -0.1],
    ["zoomOutButton0.5", -0.5],
];

for (const [id, delta] of ZOOM_BUTTONS) {
    document.getElementById(id).addEventListener("click", () => tool.zoom(delta));
}

// 方便控制台调试
window.animationDev = tool;
window.animationDevKeyboard = keyboard;
