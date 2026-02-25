const projectNameNonAsciiNote = document.getElementById("project-name-non-ascii-note")
// 项目名
document.getElementById("project-name-input").addEventListener("input", function (event) {
    if (this.value == "") {
        generalData.projectName = null;
    } else {
        this.value = this.value.replace(/\s+/g, '-'); // 替换空格为连字符
        this.value = this.value.replace(/-+/g, '-'); // 保证连字符只有一个
        this.value = this.value.replace(/['"]/g, ''); // 移除引号

        generalData.projectName = this.value;
    }

    if (Web.hasNonAscii(this.value)) {
        projectNameNonAsciiNote.textContent = "项目名建议只包含英文字母"
    } else {
        projectNameNonAsciiNote.textContent = null;
    }
})

const levelSelect = document.getElementById("level-input");
const peopleInput = document.getElementById("people-input");
// 类型的监听
document.getElementById("type-input").addEventListener("input", function (event) {
    switch (this.value) {
        case "residential":
        case "commercial":
        case "industrial":
        case "farm":
        case "harbor ind":
            generalData.currentMode = "rci";

            // 设置等级选项的属性
            levelSelect.required = true;
            levelSelect.options[0].disabled = true;

            peopleInput.name  = "people";
            break;
        case "education": // 小学教育
            peopleInput.name = "provide aspect education low";
            break;
        case "$education": // 高等教育
            peopleInput.name = "provide aspect education high";
            break;
        case "medic":
            peopleInput.name = "provide aspect health care";
            break;
        default:
            generalData.currentMode = "service";
            levelSelect.required = false;
            levelSelect.options[0].disabled = false;
            peopleInput.name = "people";
            break;
    }
})

// 供水/电、影响数值计算函数
const monthlyPriceInput = document.getElementById("monthly-price-input");
const widthInput = document.getElementById("width-input");
const heightInput = document.getElementById("height-input");
function refreshProvideInfluenceValue() {
    let width = Math.max(0, Math.min(16, parseInt(widthInput.value)));
    let height = Math.max(0, Math.min(16, parseInt(heightInput.value)));
    let monthlyPrice = Math.max(0, monthlyPriceInput.value);

    // 顺便检查width，height和monthly price的合法性
    widthInput.value = !width ? null : width;
    heightInput.value = !height ? null : height;
    monthlyPriceInput.value = !monthlyPrice ? null : monthlyPrice;

    let s = Number.isNaN(width * height) ? 0 : width * height;

    let maxProvide = 0;
    let maxInfluence = 0;
    if (s != 0) {
        maxProvide = Math.min(1e5 * s, Math.min(20 * monthlyPrice, 1e6));
        maxInfluence = (10 * Math.min(monthlyPrice, 1e6)) / s;
    }

    document.getElementById("provide-info-para").textContent = `正数为供应，负数为消耗，当前最大值：${maxProvide}（受面积和每月费用影响）`;
    document.getElementById("influence-value-label").textContent = `数值(最大${maxInfluence})`;
}

// 监听每月收入、建筑尺寸
monthlyPriceInput.addEventListener("input", refreshProvideInfluenceValue);
widthInput.addEventListener("input", refreshProvideInfluenceValue);
heightInput.addEventListener("input", refreshProvideInfluenceValue);

// 监听动画旋转感知
const animationRotationAwareInput = document.getElementById("animation-rotation-aware-input");
const animationRotationAwareInfoPara = document.getElementById("animation-rotation-aware-info-para");
animationRotationAwareInput.addEventListener("input", function() {
    let value = animationRotationAwareInput.checked;
    if (value) {
        animationRotationAwareInfoPara.textContent = "旋转感知已启用，意味着您需要为动画提供4个方向的贴图";
    } else {
        animationRotationAwareInfoPara.textContent = null;
    }
})