// 添加新动画
let tileTempleteImage;
loadImage("./media/1x1.png", (image) => {
    tileTempleteImage = image;
})

const newAnimationCanvas = document.getElementById("new-animation-canvas");
let animationCache = { // 暂存动画信息
    frame: null,
    handleX: 0,
    handleY: 0
};
/**
 * 绘制动画预览
 * @param {HTMLImageElement} animationFrame 动画图像(Image实例)
 * @param {Number} handleX 水平方向偏移量
 * @param {Number} handleY 竖直方向偏移量
 */
function drawNewAnimationPreview(animationFrame, handleX = 0, handleY = 0) {
    const originOffset = { x: 100, y: 40 };
    const zoom = 2.6;
    let ctx = newAnimationCanvas.getContext("2d");

    // 关键修复：重置变换矩阵
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    // 清空画布
    ctx.clearRect(0, 0, newAnimationCanvas.width, newAnimationCanvas.height);

    // 移动原点到指定位置
    ctx.translate(originOffset.x, newAnimationCanvas.height - originOffset.y);

    // 绘制坐标轴（使用原始坐标系，不要缩放）
    ctx.beginPath();
    ctx.strokeStyle = "white";
    ctx.lineWidth = 0.5;
    ctx.moveTo(0, -(newAnimationCanvas.height - originOffset.y));
    ctx.lineTo(0, originOffset.y);
    ctx.moveTo(-originOffset.x, 0);
    ctx.lineTo(newAnimationCanvas.width - originOffset.x, 0);
    ctx.stroke();

    // 保存当前状态（缩放前）
    ctx.save();

    // 应用缩放
    ctx.scale(zoom, zoom);

    // 禁用平滑处理
    ctx.imageSmoothingEnabled = false;

    // 绘制底座
    if (tileTempleteImage) {
        ctx.drawImage(tileTempleteImage, 0, -8);
    } else {
        ctx.font = "16px 'sans-serif'";
        ctx.fillStyle = "white";
        ctx.fillText("[新动画] 加载中...", 0, 0);
    }

    // 绘制动画贴图
    if (animationFrame) {
        if (animationCache.frame !== animationFrame) {
            animationCache.frame = animationFrame;
            console.log("[新动画] 缓存动画图片", animationFrame);
        }
        animationCache.handleX = handleX;
        animationCache.handleY = handleY;

        ctx.drawImage(animationFrame, handleX, -handleY);
        console.log("[新动画] 绘制动画图片", animationFrame, handleX, handleY);
    }

    // 恢复状态（恢复到缩放前的状态）
    ctx.restore();

    console.log("[新动画] 绘制动画预览完成");
}
// 显示对话框
function showAddNewAnimationDialog() {
    let dialog = document.getElementById("add-new-animation-dialog");
    dialog.showModal();
    console.log(`[对话框] 打开添加新动画对话框`); // 日志：对话框打开
    drawNewAnimationPreview();
}
// 监听添加新动画按钮
document.getElementById("add-new-animation-button").addEventListener("click", () => {
    showAddNewAnimationDialog()
})
// 监听新动画贴图文件输入
const newAnimationFileInput = document.getElementById("animation-frame-input");
newAnimationFileInput.addEventListener("input", () => {
    let frame;
    loadImage(newAnimationFileInput.files[0], (image) => {
        frame = image;
        drawNewAnimationPreview(frame, 0, 0);
    });
})
// 监听Handle X和Handle Y
const newAnimationHandleXInput = document.getElementById("animation-handle-x-input");
newAnimationHandleXInput.addEventListener("input", () => {
    drawNewAnimationPreview(animationCache.frame, parseInt(newAnimationHandleXInput.value ?? 0), animationCache.handleY);
})
const newAnimationHandleYInput = document.getElementById("animation-handle-y-input");
newAnimationHandleYInput.addEventListener("input", () => {
    drawNewAnimationPreview(animationCache.frame, animationCache.handleX, parseInt(newAnimationHandleYInput.value ?? 0));
})
// 提交新动画 
function addNewAnimationSubmit() {
    let innerId = randomId("inner");
    let animation = {
        id: document.getElementById("animation-id-input").value,
        frame: newAnimationFileInput.files[0],
        handleX: parseInt(newAnimationHandleXInput.value),
        handleY: parseInt(newAnimationHandleYInput.value)
    }
    // 检查数据
    if (animation.id && animation.frame) {
        animation.frameName = newAnimationFileInput.files[0].name // 在贴图存在时再读取文件名并添加 
        animationData[innerId] = animation;
        console.log("[新动画] 新动画提交", animation);
    } else {
        alert("错误：缺少ID或贴图帧");
    }
}
function deleteAnimation(innerId) {
    delete animationData[innerId];
}

let _animationData = {} // 动画数据
// 监听动画数据并实时呈现
const animationData = new Proxy(_animationData, {
    set(obj, prop, value) {
        const oldValue = obj[prop];
        if (oldValue !== value) {
            obj[prop] = value;
            refreshAnimationList(animationData);
        }
        console.log("[动画数据代理] 检测到数据变化", prop, "->", value);
        return true;
    },
    deleteProperty(obj, prop) {
        delete obj[prop];
        refreshAnimationList(animationData);
        console.log("[动画数据代理] 检测到数据变化 删除", prop);
        return true;
    }
})
// 实时呈现到动画列表
const animationList = document.getElementById("animation-list");
function refreshAnimationList(data) {
    animationList.innerHTML = "";
    for (let i = 0; i < Object.keys(data).length; i++) {
        const innerId = Object.keys(data)[i];
        // 创建行
        let item = document.createElement("div");
        item.classList = "underline flex";
        animationList.appendChild(item);
        // 创建id段落
        let animationId = document.createElement("p");
        animationId.innerHTML = `${data[innerId].id}&emsp;&emsp;<b>handle x</b>：${data[innerId].handleX}&emsp;<b>handle y</b>：${data[innerId].handleY}`;
        item.appendChild(animationId);
        // 创建操控栏
        let controls = document.createElement("div");
        item.appendChild(controls);
        // 创建删除按钮
        let deleteButton = document.createElement("button");
        deleteButton.classList = "button-small";
        deleteButton.textContent = "删除";
        deleteButton.addEventListener("click", () => {
            deleteAnimation(innerId);
        });
        controls.appendChild(deleteButton);
    }
    console.log("[动画列表] 动画列表刷新");
}