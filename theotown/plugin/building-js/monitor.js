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

// 类型的监听
document.getElementById("type-input").addEventListener("input", function(event) {
    switch(this.value) {
        case "residential":
        case "commercial":
        case "industrial":
        case "farm":
        case "harbor ind":
            generalData.currentMode = "rci";

            // 设置等级选项的属性
            let levelSelect = document.getElementById("level-input");
            levelSelect.required = true;
            levelSelect.options[0].disabled = true;
            break;
        default:
            generalData.currentMode = "service";
            break;
    }
})

// 监听每月收入