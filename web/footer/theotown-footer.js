class TheotownFooter extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <footer class="theotown-footer">
            <div class="footer-box">
                <div>
                    © 2026 JiuruMeow ·
                    Powered by <a href="https://www.cloudflare.com/">Cloudflare</a> and <a href="https://github.com/">GitHub</a> 
                </div>
                <div class="footer-about">
                    <a href="/">我的主页</a>
                    <a href="https://forum.theotown.com/">官方论坛</a>
                    <a href="/theotown/index.html">更多内容</a>
                </div>
            </div>
        </footer>
        `;
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
