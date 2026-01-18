const params = new URLSearchParams(window.location.search);
const title = params.get("title");
const sourcesParam = params.get("sources");

const navBar = document.getElementById("navBar");

if (title) {
    document.getElementById("headerTitle").innerText = title;
} else {
    document.getElementById("headerTitle").innerText = "下载页面";
}

if (sourcesParam) {
    try {
        const sources = JSON.parse(decodeURIComponent(sourcesParam));
        
        for (let i = 0; i < sources.length; i++) {
            const siteName = sources[i].name;
            const siteUrl = sources[i].url;
            
            // 创建按钮的正确方式
            const button = document.createElement("button");
            button.textContent = siteName;
            button.onclick = function() {
                // 移除其他按钮的active类
                document.querySelectorAll('#navBar button').forEach(btn => {
                    btn.classList.remove("active");
                });
                
                // 给当前按钮添加active类
                this.classList.add("active");
            };
            
            navBar.appendChild(button);
        }
    } catch (error) {
        navBar.innerHTML = "<p style='color:red'>数据解析失败</p>";
        console.error(error);
    }
} else {
    navBar.innerHTML = "<p>没有数据</p>";
}