class GeneralFooter extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <footer>
            <div class="footer-box">
                <p>Made by JiuruMeow</p>
                <div class="footer-about">
                    <a href="https://space.bilibili.com/629492211">Bilibili</a>
                </div>        
            </div>
        </footer>
        `;
    }
}

customElements.define('general-footer', GeneralFooter);