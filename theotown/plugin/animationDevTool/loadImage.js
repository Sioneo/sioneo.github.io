let buildingImage = null;
let animationImage = null;

const canvas = document.getElementById("mainCanvas");
const ctx = canvas.getContext("2d");
var origin = { x: 200, y: 600 };
var animationPos = { x: 0, y: 0 };
let canvasSize = { width: document.getElementById("mainContainer").clientWidth, height: 800 }
let templete = { width: 1, height: 1 }

// 加载图片的简单函数
function loadImage(file) {
    return new Promise((resolve) => {
        if (!file) {
            console.log("无文件，返回 null");
            resolve(null);
            return;
        }

        console.log(`开始加载文件: ${file.name}`);

        const reader = new FileReader();

        reader.onload = function (e) {
            const img = new Image();
            img.onload = () => {
                console.log(`图片加载成功: ${file.name}, 尺寸: ${img.width}x${img.height}`);
                resolve(img);
            };
            img.onerror = () => {
                console.error(`图片加载失败: ${file.name}`);
                resolve(null);
            };
            img.src = e.target.result;
        };

        reader.onerror = () => {
            console.error(`文件读取失败: ${file.name}`);
            resolve(null);
        };

        reader.readAsDataURL(file);
    });
}

// 确认按钮点击事件
document.getElementById("fileConfirmButton").addEventListener("click", async function () {
    if (parseInt(document.getElementById("templeteWidth").value)) {
        const buildingFile = document.getElementById("fileInputBuilding").files[0];
        const animationFile = document.getElementById("fileInputAnimation").files[0];
    
        console.log("选择的文件:", {
            building: buildingFile?.name || "无",
            animation: animationFile?.name || "无"
        });
    
        // 检查是否选择了文件
        if (!buildingFile && !animationFile) {
            console.log("没有选择任何文件");
            hint("请选择至少一个图片文件");
            return;
        }
    
        hint("正在加载图片...");
    
        // 分别加载图片
        buildingImage = await loadImage(buildingFile);
        animationImage = await loadImage(animationFile);
    
        console.log("加载结果:", {
            buildingImage: buildingImage ? "✅" : "❌",
            animationImage: animationImage ? "✅" : "❌"
        });
    
        hint("图片已加载");
        animationPos = { x: 0, y: 0 }
        draw();
    } else {
        alert("请输入底座长度和宽度");
        hint("请输入底座长度和宽度");
    }

    
});


function getOriginToEdge() {
    return {
        up: origin.y,
        down: Math.abs(canvasSize.height - origin.y),
        left: origin.x,
        right: Math.abs(canvasSize.width - origin.x)
    };
}
let originToEdge = getOriginToEdge();

function refreshCanvas() {
    canvas.width = canvasSize.width;
    canvas.height = canvasSize.height;
    originToEdge = getOriginToEdge();
    templete.width = parseInt(document.getElementById("templeteWidth").value);
    templete.heigtt = parseInt(document.getElementById("templeteHeight").value);

    draw();
    updateInfo();
}

function draw() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.translate(origin.x, origin.y);
    ctx.save();
    // 绘制坐标轴
    ctx.beginPath();
    ctx.strokeStyle = "white";
    ctx.lineWidth = 0.5;
    // 绘制y轴
    ctx.moveTo(0, -originToEdge.up);
    ctx.lineTo(0, originToEdge.down);
    // 绘制x轴
    ctx.moveTo(-originToEdge.left, 0);
    ctx.lineTo(originToEdge.right, 0);
    ctx.stroke();

    // 绘制建筑图片
    if (buildingImage && buildingImage.complete && buildingImage.naturalWidth > 0) {
        // 可以调整绘制位置和大小
        ctx.drawImage(buildingImage,
            0, (-buildingImage.height + (templete.width * 8)), // 位置
            buildingImage.width, buildingImage.height // 大小
        );
    }

    // 绘制动画图片
    if (animationImage && animationImage.complete && animationImage.naturalWidth > 0) {
        ctx.drawImage(animationImage,
            animationPos.x, animationPos.y,
            animationImage.width, animationImage.height
        );
    }

    ctx.restore();
}

refreshCanvas();
window.addEventListener("resize", refreshCanvas);