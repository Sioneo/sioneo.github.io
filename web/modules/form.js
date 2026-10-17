// form.js

// 同时用于文本节点和双引号属性值，保留原始文本而不将其解析成 HTML。
function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, (char) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
    })[char]);
}

/* ============================================================
 * 类型转换表
 * 每个函数接收「单个元素」或「同名元素数组」，返回转换后的值
 * ============================================================ */
const TYPE_MAP = {
    string: (el) => (el.value === "" ? null : el.value),
    number: (el) => (el.value === "" ? null : Number(el.value)),
    boolean: (el) => el.checked,
    json: (el) => {
        if (el.value === "") return null;
        try {
            return JSON.parse(el.value);
        } catch {
            throw new Error(`不是合法 JSON: ${el.value}`);
        }
    },
    array: (els) => els.map((el) => el.value),
};

/* ============================================================
 * Form 类
 *
 * items: 字段声明数组
 * {
 *   id: string,            必填，唯一
 *   name: string,          必填，HTML name（合法标识符）
 *   keyName?: string,      可选，输出 JSON 的 key（可含空格等）
 *   type: string,          string | number | boolean | json | array
 *                          | select | radio | textarea | url | email | date | ...
 *   label?: string,
 *   value?: any,           默认值
 *   required?: boolean,
 *   placeholder?: string,
 *   options?: Array<{label, value}>,   // select / radio / array
 *   attrs?: object,        额外 HTML 属性
 *   help?: string,         辅助说明
 * }
 *
 * options:
 * {
 *   formId?: string,
 *   container?: string | Element,  构造时即挂载
 *   validate?: boolean,            默认 true
 *   omitEmpty?: boolean,           默认 false；为 true 时生成 JSON 会省略空字段
 *   onSubmit?: (data) => void,
 *   onChange?: (data) => void,
 * }
 * ============================================================ */
export class Form {
    constructor(items = [], options = {}) {
        const {
            formId,
            container = null,
            validate = true,
            omitEmpty = false,
            onSubmit = null,
            onChange = null,
        } = options;

        this.items = items;
        this.formId =
            formId ?? "form-" + Math.random().toString(36).slice(2, 8);

        this.validateOnSubmit = validate;
        this.omitEmpty = omitEmpty;
        this.onSubmit = onSubmit;
        this.onChange = onChange;

        this.formEl = null;    // 渲染后的 <form>
        this.container = null; // 挂载目标
        this.json = null;      // 最近一次生成的 JSON

        // 如果构造时就给了容器，直接挂载
        if (container) this.mount(container);
    }

    /* ==========================================================
     * 渲染
     * ========================================================== */

    /** 返回 HTML 字符串（不解析） */
    toHTML() {
        return Form.generateHTML(this.items, this.formId);
    }

    /**
     * 渲染并返回 <form> DOM 元素（缓存）
     * 多次调用返回同一个元素，保证 getData / validate 操作同一份 DOM
     */
    render() {
        if (this.formEl) return this.formEl;

        const template = document.createElement("template");
        template.innerHTML = this.toHTML().trim();
        this.formEl = template.content.firstElementChild;

        // 绑定 change / input 事件
        if (this.onChange) {
            this.formEl.addEventListener("input", () => {
                this.onChange(this.getData());
            });
        }

        // 绑定 submit（阻止默认提交）
        this.formEl.addEventListener("submit", (e) => {
            e.preventDefault();
            if (!this.validateOnSubmit) {
                this.onSubmit?.(this.getData());
                return;
            }
            const json = this.generate();
            if (json !== null) {
                this.onSubmit?.(this.getData());
            }
        });

        return this.formEl;
    }

    /** 挂载到容器 */
    mount(target, { replace = false } = {}) {
        const el = Form.resolveTarget(target);
        if (!el) throw new Error("Form.mount: 找不到挂载目标");

        const node = this.render();
        if (replace) {
            el.replaceChildren(node);
        } else {
            el.appendChild(node);
        }

        this.container = el;
        return this;
    }

    /** 从容器卸载（不销毁实例，可再次 mount） */
    unmount() {
        if (this.formEl?.parentNode) {
            this.formEl.parentNode.removeChild(this.formEl);
        }
        this.container = null;
        return this;
    }

    /* ==========================================================
     * 读取 / 校验 / 生成
     * ========================================================== */

    /**
     * 读取表单数据为普通对象
     * - 按 data-type 做类型转换
     * - 输出 key 优先用 data-keyname，否则用 name
     * - checkbox 未勾选也会返回 false（不会消失）
     */
    getData() {
        if (!this.formEl) this.render();

        const result = {};
        const handled = new Set();

        for (const el of this.formEl.elements) {
            if (!el.name || el.disabled) continue;
            if (handled.has(el.name)) continue;

            const type = el.dataset.type || "string";
            const key = el.dataset.keyname || el.name;

            const sameName = this.formEl.querySelectorAll(`[name="${CSS.escape(el.name)}"]`);
            const els = [...sameName].filter((e) => !e.disabled);

            // 数组由字段类型决定，即使只有一个选项也返回数组。
            if (type === "array") {
                result[key] = TYPE_MAP.array(els.filter((e) => e.checked));
                handled.add(el.name);
                continue;
            }

            // ---- radio：找选中的那个 ----
            if (el.type === "radio") {
                const checked = els.find((e) => e.checked);
                result[key] = checked ? checked.value : null;
                handled.add(el.name);
                continue;
            }

            // ---- 同名多个：多选 checkbox / array ----
            if (sameName.length > 1) {
                if (el.type === "checkbox") {
                    result[key] = els
                        .filter((e) => e.checked)
                        .map((e) => e.value);
                } else {
                    result[key] = els.map((e) => e.value);
                }
                handled.add(el.name);
                continue;
            }

            // ---- 单个字段：按 data-type 转换 ----
            const convert = TYPE_MAP[type] || TYPE_MAP.string;
            try {
                result[key] = convert(el);
            } catch (err) {
                throw new Error(`字段 "${el.name}" 解析失败: ${err.message}`);
            }
            handled.add(el.name);
        }

        return result;
    }

    /** 校验表单，不通过时弹出原生提示 */
    validate() {
        if (!this.formEl) this.render();
        if (!this.formEl.checkValidity()) {
            this.formEl.reportValidity();
            return false;
        }
        return true;
    }

    /** 生成 2 空格缩进的 JSON 字符串，校验不通过返回 null
     *  omitEmpty 为 true 时，值为 null / undefined 的空字段不写入 JSON
     */
    generate() {
        if (!this.validate()) return null;
        this.json = JSON.stringify(this.omitEmptyFields(this.getData()), null, 2);
        return this.json;
    }

    /** 去掉值为 null / undefined 的字段；omitEmpty 为 false 时原样返回 */
    omitEmptyFields(data) {
        if (!this.omitEmpty) return data;
        const result = {};
        for (const [key, value] of Object.entries(data)) {
            if (value !== null && value !== undefined) result[key] = value;
        }
        return result;
    }

    /** 重置表单并清空缓存 */
    reset() {
        if (!this.formEl) this.render();
        this.formEl.reset();
        this.json = null;
        return this;
    }

    /* ==========================================================
     * 静态工具
     * ========================================================== */

    /** 把「选择器字符串 / DOM 元素」统一解析为 DOM 元素 */
    static resolveTarget(target) {
        if (!target) return null;
        if (target instanceof Element) return target;
        if (typeof target === "string") {
            return document.querySelector(target);
        }
        return null;
    }

    /** 生成完整表单 HTML */
    static generateHTML(items, formId = "form") {
        const fields = items.map((item) => Form.renderField(item)).join("\n");
        return `<form id="${escapeHTML(formId)}" novalidate>\n${fields}\n</form>`;
    }

    /** 渲染单个字段 */
    /** 渲染单个字段 */
    static renderField(item) {
        const {
            name,
            keyName,
            type = "string",
            label = "",
            value,
            required = false,
            placeholder = "",
            options = [],
            attrs = {},
            help = "",
        } = item;

        // 注意：字段 id 相关逻辑暂时移除，后续善后（见文末备注）
        if (!name) throw new Error(`Form: 字段缺少 name`);

        const requiredAttr = required ? "required" : "";
        const helpHTML = help ? `<small class="field-help">${escapeHTML(help)}</small>` : "";
        // 暂无 id，label 先不带 for；以后可恢复 for 或改成包裹式
        const labelHTML = label
            ? `<label>${escapeHTML(label)}${required ? " *" : ""}</label>`
            : "";

        const extraAttrs = Object.entries(attrs)
            .map(([k, v]) => {
                if (!/^[^\s"'<>/=]+$/.test(k)) {
                    throw new Error(`Form: 非法属性名 "${k}"`);
                }
                return `${k}="${escapeHTML(v)}"`;
            })
            .join(" ");

        // data-keyname 只在 keyName 存在且不等于 name 时加
        const keyAttr =
            keyName && keyName !== name ? ` data-keyname="${escapeHTML(keyName)}"` : "";

        let control = "";

        switch (type) {
            case "boolean":
                control =
                    `<input type="checkbox" name="${escapeHTML(name)}" ` +
                    `data-type="boolean"${keyAttr}` +
                    `${value ? " checked" : ""} ${requiredAttr} ${extraAttrs} />`;
                break;

            case "number":
                control =
                    `<input type="number" name="${escapeHTML(name)}" ` +
                    `data-type="number"${keyAttr} value="${escapeHTML(value)}" ` +
                    `placeholder="${escapeHTML(placeholder)}" ${requiredAttr} ${extraAttrs} />`;
                break;

            case "json":
                control =
                    `<textarea name="${escapeHTML(name)}" data-type="json"${keyAttr} ` +
                    `placeholder="${escapeHTML(placeholder)}" ${requiredAttr} ${extraAttrs}>` +
                    `${escapeHTML(value)}</textarea>`;
                break;

            case "textarea":
                control =
                    `<textarea name="${escapeHTML(name)}" data-type="string"${keyAttr} ` +
                    `placeholder="${escapeHTML(placeholder)}" ${requiredAttr} ${extraAttrs}>` +
                    `${escapeHTML(value)}</textarea>`;
                break;

            case "array":
                control =
                    `<div class="checkbox-group" data-name="${escapeHTML(name)}" ` +
                    `data-type="array"${keyAttr}>` +
                    options
                        .map(
                            (opt) =>
                                `<label><input type="checkbox" name="${escapeHTML(name)}" ` +
                                `data-type="array"${keyAttr} ${extraAttrs} ` +
                                `value="${escapeHTML(opt.value)}"` +
                                `${Array.isArray(value) && value.includes(opt.value)
                                    ? " checked"
                                    : ""
                                } /> ${escapeHTML(opt.label)}</label>`
                        )
                        .join("") +
                    `</div>`;
                break;

            case "select":
                control =
                    `<select name="${escapeHTML(name)}" data-type="string"${keyAttr} ` +
                    `${requiredAttr} ${extraAttrs}>` +
                    `<option value="">请选择</option>` +
                    options
                        .map(
                            (opt) =>
                                `<option value="${escapeHTML(opt.value)}"` +
                                `${value === opt.value ? " selected" : ""}>` +
                                `${escapeHTML(opt.label)}</option>`
                        )
                        .join("") +
                    `</select>`;
                break;

            case "radio":
                control =
                    `<div class="radio-group" data-name="${escapeHTML(name)}" ` +
                    `data-type="string"${keyAttr}>` +
                    options
                        .map(
                            (opt) =>
                                `<label><input type="radio" name="${escapeHTML(name)}" ` +
                                `data-type="string"${keyAttr} ${requiredAttr} ${extraAttrs} ` +
                                `value="${escapeHTML(opt.value)}"` +
                                `${value === opt.value ? " checked" : ""} /> ` +
                                `${escapeHTML(opt.label)}</label>`
                        )
                        .join("") +
                    `</div>`;
                break;

            // string / url / email / date / password / tel / ...
            default:
                control =
                    `<input type="${escapeHTML(type)}" name="${escapeHTML(name)}" ` +
                    `data-type="string"${keyAttr} value="${escapeHTML(value)}" ` +
                    `placeholder="${escapeHTML(placeholder)}" ${requiredAttr} ${extraAttrs} />`;
        }

        return (
            `<div class="line" data-field="${escapeHTML(name)}">\n
        ${labelHTML}\n
        ${control}\n
        ${helpHTML}\n
      </div>`
        );
    }

    /**
   * 根据字段的 name 返回该行的 DOM 元素
   * @param {string} name 字段的 name（或 keyName）
   * @returns {HTMLElement|null}
   */
    getLineByName(name) {
        if (!this.formEl) this.render();
        return this.formEl.querySelector(`[data-field="${CSS.escape(name)}"]`);
    }
}
