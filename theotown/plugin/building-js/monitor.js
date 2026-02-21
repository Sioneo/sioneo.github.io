const projectNameInput = document.getElementById("project-name-input");
projectNameInput.addEventListener("input", function (event) {
    if (projectNameInput.value == "") {
        generalData.projectName = null;
    } else {
        this.value = this.value.replace(/\s+/g, '-');
        this.value = this.value.replace(/-+/g, '-');

        generalData.projectName = this.value;
    }
})