const browserVersion = document.getElementById("browser-version");
const browserInfo = document.getElementById("browser-info");

function getBrowserInfo() {
    const ua = navigator.userAgent;
    const info = {
        kernel: 'Unknown',
        browser: 'Unknown',
        version: 'Unknown'
    };
    
    // 检测内核
    if (ua.indexOf('AppleWebKit') > -1) {
        info.kernel = 'WebKit';
        
        // 判断具体浏览器
        if (ua.indexOf('Chrome') > -1 && ua.indexOf('Edg') === -1) {
            info.browser = 'Chrome';
            const match = ua.match(/Chrome\/(\d+)/);
            info.version = match ? match[1] : 'Unknown';
        } else if (ua.indexOf('Safari') > -1 && ua.indexOf('Chrome') === -1) {
            info.browser = 'Safari';
            const match = ua.match(/Version\/(\d+)/);
            info.version = match ? match[1] : 'Unknown';
        } else if (ua.indexOf('Edg') > -1) {
            info.browser = 'Edge (Chromium)';
            const match = ua.match(/Edg\/(\d+)/);
            info.version = match ? match[1] : 'Unknown';
        }
    } else if (ua.indexOf('Gecko') > -1 && ua.indexOf('KHTML') === -1) {
        info.kernel = 'Gecko';
        info.browser = 'Firefox';
        const match = ua.match(/Firefox\/(\d+)/);
        info.version = match ? match[1] : 'Unknown';
    } else if (ua.indexOf('Trident') > -1) {
        info.kernel = 'Trident';
        info.browser = 'IE';
        const match = ua.match(/MSIE (\d+)|rv:(\d+)/);
        info.version = match ? (match[1] || match[2]) : 'Unknown';
    }
    
    return info;
}

const result = getBrowserInfo();
browserVersion.innerText = `${result.browser} ${result.version}`;