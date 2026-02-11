class TheotownFooter extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <footer class="theotown-footer">
            <div class="footer-box">
                <div class="footer-about">
                    <h6>AzureWiki</h6>
                    <a href="https://forum.theotown.com/" target="_blank">论坛</a>
                    <a href="https://pd.qq.com/s/89j7ypse8" target="_blank">QQ交流频道</a>
                </div>
                <div class="footer-about">
                    <a href="https://www.azureneko.top/theotown/onionpedia.html" target="_blank">关于本站</a>
                    <a href="https://www.azureneko.top/theotown/me.html" target="_blank">关于我</a>
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