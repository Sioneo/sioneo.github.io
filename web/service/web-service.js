// Web 相关服务
//
// 出站链接说明：页面里不再手写 target="_blank"，是否跳站外由本文件末尾的
// initOutbound() 统一判断，命中时补上 target="_blank" / rel="noopener"
// 并加上 .outbound 类供 CSS 标注（样式定义在 css/document.min.css）。

const Web = {
    // ---------------- 折叠面板 ----------------

    // 两种状态用的图标预先拼好，避免每次点击都重新解析 HTML
    _spoilerIcons: {
        opened: `<i class="b">k</i>`,
        closed: `<i class="b">a</i>`,
    },

    addSpoiler: function (buttonId, contentId) {
        const button = document.getElementById(buttonId);
        const content = document.getElementById(contentId);

        if (!button || !content) {
            console.error(`Spoiler 元素不存在。Button ID: ${buttonId}, Content ID: ${contentId}`);
            return;
        }

        button.addEventListener("click", function () {
            const opened = button.classList.toggle("active");
            content.classList.toggle("active", opened);
            button.innerHTML = opened ? Web._spoilerIcons.opened : Web._spoilerIcons.closed;
        });
    },

    // ---------------- 提示 ----------------

    throwError: function (msg) {
        if (typeof msg == "string") {
            alert(msg);
            console.error(msg);
        } else {
            alert("发生未知错误");
            console.warn("发生未知错误");
        }
    },

    // ---------------- 设备 ----------------

    // 返回 [device, platform]，device 为 phone / tablet / desktop
    // 注意：这里只提供判断结果，不要用它去覆盖 CSS 变量 —— 那会和
    // css/document.min.css 里的媒体查询 / clamp 冲突。
    getDeviceType: function () {
        const userAgent = navigator.userAgent;
        const isAndroid = /Android/i.test(userAgent);
        const isIOS = /iPhone|iPad|iPod/i.test(userAgent);
        const isTablet = /iPad|Tablet|PlayBook|Silk/i.test(userAgent);

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

    // ---------------- 杂项 ----------------

    hasNonAscii: function (str) {
        return /[^\x00-\x7F]/.test(str);
    },

    getSelectTextByValue: function (selectId, value) {
        const select = document.getElementById(selectId);
        if (!select) return null;

        const option = Array.from(select.options).find(opt => opt.value === value);
        return option ? option.text : null;
    },

    // ---------------- 出站链接 ----------------

    // 给单个 <a> 打标记：站外补 target/rel 与 .outbound，站内确保不带 target
    markOutbound: function (a) {
        // 下载链接和显式豁免的链接不处理
        if (a.hasAttribute("download") || a.hasAttribute("data-no-outbound")) {
            a.removeAttribute("target");
            return;
        }

        let url;
        try {
            url = new URL(a.getAttribute("href"), location.href);
        } catch (e) {
            return; // href 无法解析，保持原样
        }

        const isHttp = url.protocol === "http:" || url.protocol === "https:";
        // 同源即站内。注意 file:// 打开时 location.origin 是字符串 "null"，
        // 此时 http(s) 链接都会被判为出站 —— 这正是本地预览时想要的效果。
        if (!isHttp || url.origin === location.origin) {
            a.removeAttribute("target");
            a.classList.remove("outbound");
            return;
        }

        a.target = "_blank";
        a.rel = "noopener";
        a.classList.add("outbound");
    },

    // 扫描 root 子树内的所有链接，root 省略时扫描整个文档
    initOutbound: function (root) {
        const scope = root || document;
        const links = scope.querySelectorAll("a[href]");
        for (const a of links) {
            Web.markOutbound(a);
        }
    },
};


// 常用函数
class Utilities {
    constructor(data) {
        this.hintTarget = document.getElementById(data.hintTargetId);
    }

    hint(msg = "未知信息", type = "info") {
        const text = String(msg);
        const timeMsg = `[${new Date().toISOString()}] ${text}`;

        // 目标元素不存在时只写控制台，避免后续所有提示都抛错
        if (!this.hintTarget) {
            console.log(timeMsg);
            return;
        }

        switch (type) {
            case "error":
                this.hintTarget.textContent = text;
                this.hintTarget.style.color = "var(--color-red)";
                console.error(timeMsg);
                break;
            case "warning":
                this.hintTarget.textContent = text;
                this.hintTarget.style.color = "var(--color-theme)";
                console.warn(timeMsg);
                break;
            case "log":
                // 逐条追加，用 DOM 节点代替 innerHTML 拼接
                this.hintTarget.append(document.createElement("br"), text);
                this.hintTarget.style.color = "var(--color-text)";
                console.log(timeMsg);
                break;
            case "info":
            default:
                this.hintTarget.textContent = text;
                this.hintTarget.style.color = "var(--color-text)";
                console.log(timeMsg);
                break;
        }
    }
}


// 记录设备信息供页面使用（例如 theotown/gettheotown.html 据此选择应用商店）
// 只读取一次，且不再用它去覆盖任何 CSS 变量
(function () {
    const [deviceType, devicePlatform] = Web.getDeviceType();
    Web.deviceType = deviceType;
    Web.devicePlatform = devicePlatform;
})();


// ---------------- 出站链接：自动初始化 ----------------

(function () {
    // 首屏扫描
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", function () {
            Web.initOutbound();
        });
    } else {
        Web.initOutbound();
    }

    // 兜住运行期才插入的链接：页脚是 Web Component、社区卡片是脚本生成的，
    // 静态扫描那一次扫不到。用 rAF 合并同一帧内的多次变动，避免频繁重扫。
    let scanQueued = false;

    new MutationObserver(function () {
        if (scanQueued) return;
        scanQueued = true;

        requestAnimationFrame(function () {
            scanQueued = false;
            Web.initOutbound();
        });
    }).observe(document.documentElement, { childList: true, subtree: true });
})();
