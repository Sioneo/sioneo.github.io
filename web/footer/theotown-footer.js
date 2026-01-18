class TheotownFooter extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <footer class="theotown-footer">
            <p>最后一次更新：<span id="webInfoUpdateTime"></span></p>
            <div class="footer-box">
                <p>本站基于<a href="https://githubdocs.cn/en/pages/getting-started-with-github-pages/about-github-pages"
                        target="_blank" class="github-page-note"><i class="w">Q</i>GitHub Pages</a>搭建</p>
                <div class="footer-about">
                    <a href="https://www.azureneko.top/theotown/onionpedia.html" target="_blank">关于本站</a>
                    <a href="https://www.azureneko.top/theotown/me.html" target="_blank">关于我</a>
                </div>
            </div>
        </footer>
        `;
        
        // 直接调用 Web 函数，但需要等待 DOM 更新
        setTimeout(() => {
            if (window.Web && Web.showPageUpdateTime) {
                Web.showPageUpdateTime();
            } else {
                console.warn('Web 对象或 showPageUpdateTime 方法未找到');
                this.updateTimeFallback();
            }
        }, 0);
    }
    
    updateTimeFallback() {
        const updateTimeSpan = document.getElementById('webInfoUpdateTime');
        if (updateTimeSpan) {
            const updateTime = new Date(document.lastModified);
            updateTimeSpan.innerText = updateTime.toLocaleString();
        }
    }
}

customElements.define('theotown-footer', TheotownFooter);