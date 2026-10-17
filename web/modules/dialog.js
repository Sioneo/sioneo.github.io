export class Dialog {
    constructor(options) {
        this.id = options.id ?? crypto.randomUUID();
        this.title = options.title;
        this.content = options.content;
        this.controls = options.controls;

        // ★ 统一记录所有监听器，方便 destroy 时批量解绑
        this._listeners = [];
        // ★ 防止重复 destroy
        this._destroyed = false;

        this.dialogDOM = this.buildDialogHTML();
        this.show();
    }

    // 辅助：添加并记录监听器
    _on(target, type, handler) {
        target.addEventListener(type, handler);
        this._listeners.push({ target, type, handler });
        return handler;
    }

    buildDialogHTML() {
        const dialog = document.createElement("dialog");
        dialog.id = this.id;

        const header = document.createElement("div");
        header.classList.add("dialog-header");

        const title = document.createElement("h3");
        title.textContent = this.title;
        title.classList.add("dialog-title");
        header.appendChild(title);

        const closeButton = document.createElement("button");
        closeButton.type = "button";
        closeButton.innerHTML = `<span class="gg-icon gg-close"></span>`;
        // ★ 绑定关闭
        this._on(closeButton, "click", () => this.close());
        header.appendChild(closeButton);

        const content = document.createElement("div");
        content.classList.add("dialog-content");
        content.innerHTML = this.content;

        const controls = document.createElement("div");
        controls.classList.add("dialog-controls");
        for (const value of this.controls) {
            const button = document.createElement("button");
            button.type = "button";
            button.innerHTML = value.text;
            // ★ 真正调用回调
            this._on(button, "click", () => value.callback?.());
            controls.appendChild(button);
        }

        dialog.appendChild(header);
        dialog.appendChild(content);
        dialog.appendChild(controls);

        // ★ 用户按 Esc 时 dialog 会 close，destroy 前确保收尾
        this._on(dialog, "close", () => { /* 可留空或触发 onClose */ });

        return dialog;   // ★ 别忘了
    }

    show() {
        if (this._destroyed) throw new Error("Dialog already destroyed");
        document.body.appendChild(this.dialogDOM);   // ★ dialog 需要挂到 DOM 才能 showModal
        this.dialogDOM.showModal();
    }

    close() {
        if (this._destroyed) return;
        if (this.dialogDOM.open) this.dialogDOM.close();
    }

    destroy() {
        if (this._destroyed) return;      // ★ 幂等
        this._destroyed = true;

        // 1. 关闭（触发 close 事件，浏览器会恢复焦点等）
        if (this.dialogDOM.open) this.dialogDOM.close();

        // 2. 解绑所有事件
        for (const { target, type, handler } of this._listeners) {
            target.removeEventListener(type, handler);
        }
        this._listeners.length = 0;

        // 3. 从 DOM 移除
        this.dialogDOM.remove();

        // 4. 切断引用，便于 GC
        this.dialogDOM = null;
        this.controls = null;
        this.content = null;
        this.title = null;
    }
}