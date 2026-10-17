/* module-animation-dev.js
 * 动画开发工具的核心模块：画布预览 + 状态计算
 *
 * 职责边界
 *   类内部：创建并挂载 canvas、测量尺寸、状态计算（原点 / 动画偏移 / 缩放 / 选中）、
 *           按键响应、实时绘制
 *   类外部：所有 DOM 数据呈现（提示条、原点信息、动画列表、缩放系数……）
 *           由 onChange / onHint / onError 三个回调抛出，见 pages/animation-dev/js/main.js
 */
import File from "../../../web/modules/file.js";

// move() 的作用目标
export const TARGET = {
    ORIGIN: "origin",
    ANIMATION: "animation",
};

// 把各种「文件来源」统一成 File 数组：
// 选择器 / <input type="file"> / FileList / File 数组 / 单个 File
function toFiles(source) {
    if (!source) return [];
    if (typeof source === "string") return toFiles(document.querySelector(source));
    if (source.files) return Array.from(source.files);
    if (Array.isArray(source)) return source;
    if (typeof source.length === "number") return Array.from(source);
    if (typeof Blob !== "undefined" && source instanceof Blob) return [source];
    return [];
}

export class AnimationDev {
    /**
     * @param {Object} options
     * @param {Element|string} options.mount    挂载点，canvas 会被追加到其中
     * @param {Object}  [options.strings]       文案表（原全局 Strings）
     * @param {number}  [options.height]        画布高度，默认 800（宽度取挂载点宽度）
     * @param {{x: number, y: number}} [options.origin] 初始坐标原点
     * @param {number}  [options.zoom]          初始动画缩放系数
     * @param {(data: Object) => void} [options.onChange] 状态变化回调
     * @param {(message: string) => void} [options.onHint] 瞬时提示回调
     * @param {(error: Error) => void} [options.onError] 错误回调，默认 console.error
     */
    constructor({
        mount,
        strings = {},
        height = 800,
        origin = { x: 200, y: 600 },
        zoom = 3,
        onChange = null,
        onHint = null,
        onError = null,
    } = {}) {
        const mountElement =
            typeof mount === "string" ? document.querySelector(mount) : mount;
        if (!mountElement) throw new Error("AnimationDev: 找不到挂载点");

        this.mountElement = mountElement;
        this.strings = strings;
        this.canvasHeight = height;
        this.initialOrigin = { ...origin };
        this.onChange = onChange;
        this.onHint = onHint;
        this.onError = onError ?? ((error) => console.error(error));

        this.canvas = this.#createCanvas();
        this.ctx = this.canvas.getContext("2d");

        this.origin = { ...this.initialOrigin };
        this.buildingSize = { width: 1, height: 1, handleX: 0, handleY: null };
        this.animations = []; // [{ name, x, y }]
        this.images = { building: [], animation: [] };
        this.zoomFactor = zoom;
        this.selected = 0;

        this.#bindResize();
        this.refresh(); // 首次测量 + 绘制 + 回调
    }

    /* ==========================================================
     * 数据
     * ========================================================== */

    /** 当前全部状态（列表的 handle 值为位移的相反数） */
    getData() {
        return {
            origin: { ...this.origin },
            zoom: this.zoomFactor,
            selected: this.selected,
            building: { ...this.buildingSize },
            hasBuildingImage: this.images.building.length > 0,
            animations: this.animations.map((animation, index) => ({
                name: animation.name,
                x: animation.x,
                y: animation.y,
                handleX: -animation.x,
                handleY: -animation.y,
                selected: index === this.selected,
            })),
        };
    }

    /* ==========================================================
     * 图片与参数
     * ========================================================== */

    /**
     * 设置建筑尺寸与 handle
     * handleY 传 null / "" / NaN 表示「不设置」（与填 0 不同）
     */
    setBuildingSize({ width, height, handleX = 0, handleY = null } = {}) {
        this.buildingSize = {
            width: Number(width),
            height: Number(height),
            handleX: Number.isNaN(Number(handleX)) ? 0 : Number(handleX),
            handleY: this.#normalizeHandle(handleY),
        };
        this.#render();
        return this.buildingSize;
    }

    /** 设置建筑贴图，只保留一张 */
    async addBuilding(source) {
        const [file] = toFiles(source);
        if (!file) return null;
        const info = await this.#loadImage(file);
        if (!info) return null;
        this.images.building = [info.image];
        this.#render();
        return info;
    }

    /** 追加一张或多张动画帧，偏移量初始化为 0 */
    async addAnimation(source) {
        const files = toFiles(source);
        const loaded = [];
        for (const file of files) {
            const info = await this.#loadImage(file);
            if (!info) continue;
            this.images.animation.push(info.image);
            this.animations.push({ name: info.name, x: 0, y: 0 });
            loaded.push(info);
        }
        if (loaded.length) this.#render();
        return loaded;
    }

    /** 清空图片与动画（保留原点、缩放和建筑参数） */
    clear() {
        this.animations = [];
        this.images = { building: [], animation: [] };
        this.selected = 0;
        this.#render();
    }

    /* ==========================================================
     * 状态操作
     * ========================================================== */

    selectAnimation(index) {
        const target = Number(index);
        if (!Number.isInteger(target) || target < 0 || target >= this.animations.length) {
            this.#hint(this.#t("ERROR_NO_ANIMATION"));
            this.#render();
            return false;
        }
        this.selected = target;
        this.#render();
        this.#hint(`${this.#t("ANIMATION_STR")}: ${target}`);
        return true;
    }

    /** 移动动画或坐标原点，dx/dy 为像素位移 */
    move(target, dx, dy = 0) {
        if (target === TARGET.ORIGIN) {
            this.origin.x += dx;
            this.origin.y += dy;
        } else {
            const animation = this.animations[this.selected];
            if (!animation) return null;
            animation.x += dx;
            animation.y += dy;
        }
        this.#render();
        return target === TARGET.ORIGIN ? { ...this.origin } : this.animations[this.selected];
    }

    setOrigin({ x, y } = {}) {
        this.origin = { x: Number(x), y: Number(y) };
        this.#render();
        return { ...this.origin };
    }

    resetOrigin() {
        this.origin = { ...this.initialOrigin };
        this.#render();
        return { ...this.origin };
    }

    resetAnimation() {
        const animation = this.animations[this.selected];
        if (!animation) return null;
        animation.x = 0;
        animation.y = 0;
        this.#render();
        return { ...animation };
    }

    /** 调整动画缩放系数，delta 可正可负 */
    zoom(delta) {
        if (this.zoomFactor + delta <= 0) return this.zoomFactor;
        this.zoomFactor = parseFloat((this.zoomFactor + delta).toFixed(1));
        this.#render();
        this.#hint(
            delta > 0
                ? `${this.#t("ZOOM_IN")} ${delta}`
                : `${this.#t("ZOOM_OUT")} ${Math.abs(delta)}`
        );
        return this.zoomFactor;
    }

    /** 重新测量画布尺寸并重绘（窗口尺寸变化时也会自动调用） */
    refresh() {
        const width = this.mountElement.clientWidth;
        if (width && this.canvas.width !== width) this.canvas.width = width;
        if (this.canvas.height !== this.canvasHeight) this.canvas.height = this.canvasHeight;
        this.#render();
        return this;
    }

    destroy() {
        if (this.resizeListener) window.removeEventListener("resize", this.resizeListener);
        this.canvas.remove();
    }

    /* ==========================================================
     * 绘制
     * ========================================================== */

    #createCanvas() {
        const canvas = document.createElement("canvas");
        canvas.className = "animation-dev-canvas";
        canvas.style.backgroundColor = "black";
        canvas.style.color = "white";
        canvas.textContent = "ERROR";
        this.mountElement.appendChild(canvas);
        return canvas;
    }

    // 坐标原点到画布四边的距离
    #originToEdge() {
        return {
            up: this.origin.y,
            down: Math.abs(this.canvas.height - this.origin.y),
            left: this.origin.x,
            right: Math.abs(this.canvas.width - this.origin.x),
        };
    }

    #draw() {
        const ctx = this.ctx;
        const canvas = this.canvas;
        const edge = this.#originToEdge();
        const building = this.buildingSize;

        // 重置变换矩阵，避免 translate/scale 累积
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.translate(this.origin.x, this.origin.y); // 以坐标原点为基准
        ctx.save();

        // 坐标轴
        ctx.beginPath();
        ctx.strokeStyle = "white";
        ctx.lineWidth = 0.5;
        ctx.moveTo(0, -edge.up);
        ctx.lineTo(0, edge.down);
        ctx.moveTo(-edge.left, 0);
        ctx.lineTo(edge.right, 0);
        ctx.stroke();

        // 禁用所有平滑处理
        ctx.imageSmoothingEnabled = false;
        ctx.mozImageSmoothingEnabled = false; // Firefox
        ctx.webkitImageSmoothingEnabled = false; // Safari
        ctx.msImageSmoothingEnabled = false; // IE

        ctx.scale(this.zoomFactor, this.zoomFactor);

        // 模板边框
        ctx.beginPath();
        ctx.strokeStyle = "green";
        ctx.lineWidth = 1.5 / this.zoomFactor;
        ctx.moveTo(0, 0);
        ctx.lineTo(16 * building.width, 8 * building.width);
        ctx.lineTo(
            16 * (building.width + building.height),
            8 * (building.width - building.height)
        );
        ctx.lineTo(16 * building.height, 8 * -building.height);
        ctx.lineTo(0, 0);
        ctx.stroke();

        // 建筑贴图
        const buildingImage = this.images.building[0];
        if (buildingImage) {
            if (building.handleY === null) {
                // 未设置 handle Y 时贴到菱形底边
                ctx.drawImage(
                    buildingImage,
                    -building.handleX,
                    -buildingImage.height + building.width * 8,
                    buildingImage.width,
                    buildingImage.height
                );
            } else {
                ctx.drawImage(
                    buildingImage,
                    -building.handleX,
                    -building.handleY,
                    buildingImage.width,
                    buildingImage.height
                );
            }
        }

        // 动画帧
        for (let i = 0; i < this.animations.length; i++) {
            const image = this.images.animation[i];
            if (!image) continue;
            ctx.drawImage(image, this.animations[i].x, this.animations[i].y, image.width, image.height);
        }

        ctx.restore();
    }

    #render() {
        this.#draw();
        if (this.onChange) this.onChange(this.getData());
    }

    /* ==========================================================
     * 尺寸
     * ========================================================== */

    #bindResize() {
        this.resizeListener = () => this.refresh();
        window.addEventListener("resize", this.resizeListener);
    }

    /* ==========================================================
     * 工具
     * ========================================================== */

    async #loadImage(file) {
        try {
            return await File.readImage(file);
        } catch (error) {
            this.onError(error);
            return null;
        }
    }

    #normalizeHandle(value) {
        if (value === null || value === undefined || value === "") return null;
        const number = Number(value);
        return Number.isNaN(number) ? null : number;
    }

    #t(key) {
        return this.strings[key] ?? "";
    }

    #hint(message) {
        if (this.onHint) this.onHint(message);
    }
}

export default AnimationDev;
