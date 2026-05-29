class GeneralFooter extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <footer style="display: flex; justify-content: space-between;">
            <div>
                Copyright 2026 JiuruMeow, all rights reserved. 
                <a href="/" target="_blank">Home</a>
            </div>
            <div>
                Powered by <a href="https://www.cloudflare.com/" target="_blank">Cloudflare</a> and <a href="https://github.com/" target="_blank">GitHub</a>
            </div>
        </footer>
        `;
    }
}

customElements.define('general-footer', GeneralFooter);