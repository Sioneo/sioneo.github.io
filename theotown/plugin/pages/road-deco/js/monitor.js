// 项目名
const projectNameNonAsciiNote = document.getElementById("project-name-non-ascii-note");
document.getElementById("project-name-input").addEventListener("change", function (event) {
    if (this.value == "") {
        generalData.projectName = null;
    } else {
        this.value = this.value.replace(/\s+/g, '-'); // 替换空格为连字符
        this.value = this.value.replace(/-+/g, '-'); // 保证连字符只有一个
        this.value = this.value.replace(/['"]/g, ''); // 移除引号

        generalData.projectName = this.value;
    }

    if (Web.hasNonAscii(this.value)) {
        projectNameNonAsciiNote.textContent = "项目名建议只包含英文字母";
    } else {
        projectNameNonAsciiNote.textContent = null;
    }
})