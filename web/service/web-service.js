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

// 获取设备类型并设置样式
const deviceType = getDeviceType();
if (deviceType === "desktop") {
    // 桌面端逻辑
} else if (deviceType === "tablet") {
    document.documentElement.style.setProperty("--style-side-padding", "50px");
} else {
    document.documentElement.style.setProperty("--style-side-padding", "10px");
}

// 用于存放数据
var webData = {
    navBar: { buttons: [], contents: [] }
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
    addElementToBar: function(buttonId, contentId) {
        // 检查元素是否存在
        const button = document.getElementById(buttonId);
        const content = document.getElementById(contentId);
        
        if (!button || !content) {
            console.error(`Button or content element not found. Button ID:  $ {buttonId}, Content ID:  $ {contentId}`);
            return;
        }

        webData.navBar.buttons.push(buttonId);
        webData.navBar.contents.push(contentId);

        button.addEventListener("click", function() {
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
        });
    },

    addSpoiler: function(buttonId, contentId) {
        const button = document.getElementById(buttonId);
        const content = document.getElementById(contentId);

        button.addEventListener("click", function() {
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
    }
};