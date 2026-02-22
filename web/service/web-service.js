// 用于存放数据
var webData = {
    navBar: { buttons: [], contents: [], active: null },
};

// Web相关服务
const Web = {
    showPageUpdateTime: function () {
        const updateTimePara = document.getElementById("webInfoUpdateTime");
        if (!updateTimePara) {
            console.warn("Update time element not found.");
            return;
        }
        let updateTime = new Date(document.lastModified);
        updateTimePara.innerText = updateTime.toLocaleString();
    },

    // nav bar相关服务
    addElementToBar: function (buttonId, contentId, name, isActive) {
        // 检查元素是否存在
        const button = document.getElementById(buttonId);
        const content = document.getElementById(contentId);

        if (!button || !content) {
            console.error(`Button or content element not found. Button ID:  $ {buttonId}, Content ID:  $ {contentId}`);
            return;
        }

        if (isActive) {
            webData.navBar.active = name;
        }

        webData.navBar.buttons.push(buttonId);
        webData.navBar.contents.push(contentId);

        button.addEventListener("click", function () {
            for (let i = 0; i < webData.navBar.buttons.length; i++) {
                const btn = document.getElementById(webData.navBar.buttons[i]);
                const cnt = document.getElementById(webData.navBar.contents[i]);

                if (btn && cnt) {
                    btn.classList.remove("active");
                    cnt.classList.remove("active");
                }
            }
            button.classList.add("active");
            content.classList.add("active");
            webData.navBar.active = name;
        });
    },

    addSpoiler: function (buttonId, contentId) {
        const button = document.getElementById(buttonId);
        const content = document.getElementById(contentId);

        button.addEventListener("click", function () {
            if (button.classList.contains("active")) {
                button.classList.remove("active");
                content.classList.remove("active");
                button.innerHTML = `<i class="b">a</i>`;
            } else {
                button.classList.add("active");
                content.classList.add("active");
                button.innerHTML = `<i class="b">k</i>`;
            }
        })
    },

    throwError: function (msg) {
        if (typeof msg == "string") {
            alert(msg);
            console.error(msg);
        } else {
            alert("发生未知错误");
            console.warn("发生未知错误");
        }
    },

    // 判断是否在移动端
    getDeviceType: function () {
        const userAgent = navigator.userAgent;
        const isAndroid = /Android/i.test(userAgent);
        const isIOS = /iPhone|iPad|iPod/i.test(userAgent);
        const isTablet = /iPad|Tablet|PlayBook|Silk/i.test(userAgent); // 修正拼写

        let platform, device;

        if (isAndroid) {
            platform = "Android";
            device = isTablet ? "tablet" : "phone";
        } else if (isIOS) {
            platform = "iOS";
            device = /iPad/.test(userAgent) ? "tablet" : "phone";
        } else {
            platform = "desktop";
            device = "desktop";
        }

        return [device, platform];
    },

    hasNonAscii: function (str) {
        return /[^\x00-\x7F]/.test(str);
    }
};

// 获取设备类型并设置样式
Web.deviceType = Web.getDeviceType()[0]
Web.devicePlatform = Web.getDeviceType()[1];
if (Web.deviceType === "desktop") {
    // 桌面端逻辑
} else if (Web.deviceType === "tablet") {
    document.documentElement.style.setProperty("--style-side-padding", "60px");
} else {
    document.documentElement.style.setProperty("--style-side-padding", "30px");
}