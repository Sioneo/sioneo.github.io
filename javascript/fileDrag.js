var droppedFile = null; //通过拖拽导入的文件

// 新增拖拽区域时进行处理的函数
function newDragZone(dragZoneID, dragZoneInfoID, fileInputID) {
    const dragZone = document.getElementById(dragZoneID);
    const dragZoneInfo = document.getElementById(dragZoneInfoID);
    const fileInput = document.getElementById(fileInputID);

    // 拖放视觉反馈
    dragZone.addEventListener("dragover", () => {
        dragZone.style.border = "2px solid var(--hColor, darkblue)";
    });
    dragZone.addEventListener("dragleave", () => {
        dragZone.style.border = "2px dashed var(--hrColor, #6a6a6a)";
    });

    // 点击选择文件
    dragZone.addEventListener("click", () => fileInput.click());
    fileInput.addEventListener("change", e => {
        showFileInfo(e.target.files[0], dragZoneInfo);
        droppedFile = e.target.files[0];
    });

    // 阻止默认拖放行为
    ["dragenter", "dragover", "dragleave", "drop"].forEach(event => {
        dragZone.addEventListener(event, e => {
            e.preventDefault();
            e.stopPropagation();
        });
    });

    // 处理文件放入
    dragZone.addEventListener("drop", e => {
        droppedFile = e.dataTransfer.files[0];
        showFileInfo(droppedFile, dragZoneInfo);
        dragZone.style.border = "2px solid var(--hColor, darkblue)";
    });
}


// 显示文件信息的函数
function showFileInfo(file, dragZoneInfo) {
    if (file) {
        const fileData = {
            name: file.name,
            type: file.type,
            size: parseFloat((file.size/1024).toFixed(2)) //转换到KiB
        }

        if (fileData.type == "application/json") {
            dragZoneInfo.innerText = `文件：${fileData.name}，大小：${fileData.size}KiB`;
            dragZoneInfo.classList.remove("dragZoneInfoDefault");
            dragZoneInfo.classList.remove("dragZoneInfoError");
            dragZoneInfo.classList.add("dragZoneInfoActive");
        } else {
            dragZoneInfo.innerText = "上传的文件不是一个JSON文件";
            dragZoneInfo.classList.remove("dragZoneInfoDefault");
            dragZoneInfo.classList.remove("dragZoneInfoActive");
            dragZoneInfo.classList.add("dragZoneInfoError");
        }
    } else {
        dragZoneInfo.innerText = "导入失败，请再试一次";
    }
}
