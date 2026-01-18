class theotownPLuginToolFooter extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <div style="background-color: var(--color-box-background);" class="theotown-plugin-tool-footer">
            <p>工具版本: <span id="pluginDevToolVersion">default</span></p>
        </div>
        `
    }
}

customElements.define("theotown-plugin-tool-footer", theotownPLuginToolFooter);