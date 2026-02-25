class TheotownFooter extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <footer class="theotown-footer">
            <div class="footer-box">
                <div class="footer-about">
                    <h6>AzureWiki</h6>
                    <a href="https://forum.theotown.com/" target="_blank">论坛</a>
                    <a href="https://pd.qq.com/s/89j7ypse8" target="_blank">QQ交流频道</a>
                    <a href="https://qun.qq.com/universal-share/share?ac=1&authKey=JkBlj9ouOWCC0%2FvTtQh6TYXwrROM%2FiPISNtyvMlWmk3IHQ0HGAcRI7X6Bx01LIEt&busi_data=eyJncm91cENvZGUiOiI3Nzk4MDYwMDEiLCJ0b2tlbiI6IjRiaUl5YWh6MHM5OTJucHRXcENCV21yZHYveDdBZENqWGc3T2xNUk1KUC9GNFRCMlBsTWxsaTZRaWR0dytmN1oiLCJ1aW4iOiIxMzYwMjIzMTg0In0%3D&data=9CMSXj-S9rpPBK1QN0G-PWvJ-ZIPCRri6qoRjAUE_0pT_7U9E4iSflv-GosrmZ6V3YfQOeJUYqWdv9SmmU2Awg&svctype=4&tempid=h5_group_info" target="_blank">
                    QQ交流群(🍊群)(779806001)</a>
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