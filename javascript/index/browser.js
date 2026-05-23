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

function getModernityScore() {
    let score = 0;
    const checks = [
        // 基础特性 (每项 +5)
        { name: 'Promise', test: () => typeof Promise !== 'undefined', points: 5 },
        { name: 'fetch', test: () => typeof fetch !== 'undefined', points: 5 },
        { name: 'localStorage', test: () => typeof localStorage !== 'undefined', points: 5 },
        
        // ES6+ 特性 (每项 +10)
        { name: '箭头函数', test: () => { try { eval('()=>{}'); return true; } catch(e) { return false; } }, points: 10 },
        { name: 'const/let', test: () => { try { eval('const a=1'); return true; } catch(e) { return false; } }, points: 10 },
        { name: 'Class', test: () => { try { eval('class C{}'); return true; } catch(e) { return false; } }, points: 10 },
        
        // 现代 API (每项 +15)
        { name: 'IntersectionObserver', test: () => typeof IntersectionObserver !== 'undefined', points: 15 },
        { name: 'ResizeObserver', test: () => typeof ResizeObserver !== 'undefined', points: 15 },
        { name: 'Web Components', test: () => typeof customElements !== 'undefined', points: 15 },
        
        // 前沿特性 (每项 +20)
        { name: 'WebRTC', test: () => typeof RTCPeerConnection !== 'undefined', points: 20 },
        { name: 'Service Worker', test: () => 'serviceWorker' in navigator, points: 20 },
        { name: 'WebGL2', test: () => { try { return !!document.createElement('canvas').getContext('webgl2'); } catch(e) { return false; } }, points: 20 }
    ];
    
    for (const check of checks) {
        if (check.test()) {
            score += check.points;
        }
    }
    
    // 评级
    let level = '';
    if (score >= 130) level = "🌟走在时代最前沿！";
     else if (score >= 110) level = "⚡现代化的选择";
      else if (score >= 90) level = "✅满足日常使用";
       else if (score >= 70) level = "⚠️应该要升级一下了喔";
        else if (score >= 50) level = "❌太古老啦！";
    else if (score >= 30) level = "🚨真的还可以用吗...?";
    else level = "❔未知";
    
    return { score, level, maxScore: 100 };
}

const result = getBrowserInfo();
const evaluation = getModernityScore();
browserInfo.innerText = `${evaluation.level}`
browserVersion.innerText = `${result.browser} ${result.version}`;