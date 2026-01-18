// Update time
const Web = {
    showPageUpdateTime: function () {
        const updateTimePara = document.getElementById("webInfoUpdateTime");
        let updateTime = new Date(document.lastModified);
        updateTimePara.innerText = updateTime.toLocaleString();
    }
}