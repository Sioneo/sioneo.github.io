// 判断是否在移动端
function getDeviceType() {
    const userAgent = navigator.userAgent;
    const isAndroid = /Android/i.test(userAgent);
    const isIOS = /iPhone|iPad|iPod/i.test(userAgent);
    const isWindowsPhone = /Windows Phone/i.test(userAgent);

    if (isAndroid || isIOS || isWindowsPhone) {
        if (/(tablet|ipad|playbook|silk)|(android(?!.*mobile))/i.test(userAgent)) {
            return 'tablet';
        }
        return 'mobile';
    }

    return 'desktop';
}

if (getDeviceType() == "desktop") {

} else if (getDeviceType() == "tablet") {
    document.documentElement.style.setProperty("--style-side-padding", "50px");
} else {
    document.documentElement.style.setProperty("--style-side-padding", "10px");
}

// Update time
const Web = {
    showPageUpdateTime: function () {
        const updateTimePara = document.getElementById("webInfoUpdateTime");
        let updateTime = new Date(document.lastModified);
        updateTimePara.innerText = updateTime.toLocaleString();
    },

    // 下载服务
    newDownload: function(title, sources) {
        const url = `../web/service/download-page.html?title=${encodeURIComponent(title)}&sources=${encodeURIComponent(JSON.stringify(sources))}`
        window.open(url, "_blank");
    }
}