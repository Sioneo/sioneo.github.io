/* keyboard.js
 * 按键映射模块：把「组合键 -> 动作」声明成数据，统一绑定 keydown
 *
 * 用法
 *   const keyboard = new Keyboard([
 *       { keys: ["Ctrl", "C"], action: () => { ... } },
 *       { keys: ["Shift", "ArrowUp"], action: (event) => { ... } },
 *   ]);
 *
 * 约定
 *   - keys 中最后一个非修饰键是主键，其余是修饰键
 *   - 修饰键支持 Ctrl / Shift / Alt / Meta（以及 Control、Cmd、Option 等别名）
 *   - 修饰键必须精确匹配：["Ctrl", "C"] 不会响应 Ctrl+Shift+C
 *   - 主键按 event.key 比较且忽略大小写，因此 CapsLock 不影响按键
 *   - 命中的映射默认 preventDefault，可用 preventDefault: false 单条关闭
 */

const MODIFIER_ALIASES = {
    ctrl: "ctrl",
    control: "ctrl",
    shift: "shift",
    alt: "alt",
    option: "alt",
    meta: "meta",
    cmd: "meta",
    command: "meta",
};

function normalizeMapping(mapping, index) {
    const { keys = [], action = null, preventDefault } = mapping;
    const modifiers = new Set();
    let key = null;

    for (const name of keys) {
        const modifier = MODIFIER_ALIASES[String(name).toLowerCase()];
        if (modifier) modifiers.add(modifier);
        else key = String(name);
    }

    if (!key) {
        throw new Error(`Keyboard: 第 ${index + 1} 条映射缺少非修饰键`);
    }

    return { keys: [...keys], key, modifiers, action, preventDefault };
}

export class Keyboard {
    /**
     * @param {Array<{keys: string[], action: Function, preventDefault?: boolean}>} mappings 按键映射
     * @param {Object} [options]
     * @param {EventTarget} [options.target] 监听目标，默认 document
     * @param {boolean} [options.preventDefault] 命中时是否阻止默认行为，默认 true
     * @param {boolean} [options.autoAttach] 构造时是否立即绑定，默认 true
     */
    constructor(mappings = [], {
        target = document,
        preventDefault = true,
        autoAttach = true,
    } = {}) {
        this.mappings = mappings.map(normalizeMapping);
        this.target = target;
        this.preventDefault = preventDefault;
        this.attached = false;
        this.listener = (event) => this.handle(event);

        if (autoAttach) this.attach();
    }

    /** 绑定到目标（重复调用不会重复绑定） */
    attach(target = this.target) {
        if (this.attached) this.detach();
        this.target = target;
        this.target.addEventListener("keydown", this.listener);
        this.attached = true;
        return this;
    }

    detach() {
        if (!this.attached) return this;
        this.target.removeEventListener("keydown", this.listener);
        this.attached = false;
        return this;
    }

    destroy() {
        return this.detach();
    }

    /**
     * 处理一次 keydown；命中则执行 action 并返回该映射，否则返回 null
     * @param {KeyboardEvent} event
     */
    handle(event) {
        const matched = this.mappings.find((mapping) => this.#matches(mapping, event));
        if (!matched) return null;

        if (matched.preventDefault ?? this.preventDefault) event.preventDefault();
        matched.action?.(event, matched);
        return matched;
    }

    #matches(mapping, event) {
        if (typeof mapping.action !== "function") return false;
        if (mapping.key.toLowerCase() !== String(event.key).toLowerCase()) return false;

        const modifiers = mapping.modifiers;
        return (
            modifiers.has("ctrl") === !!event.ctrlKey &&
            modifiers.has("shift") === !!event.shiftKey &&
            modifiers.has("alt") === !!event.altKey &&
            modifiers.has("meta") === !!event.metaKey
        );
    }
}

export default Keyboard;
