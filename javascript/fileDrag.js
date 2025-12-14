// fileDrag.js - 修复版
var droppedFile = null; //通过拖拽导入的文件（备用，现在主要通过input获取）

// 新增拖拽区域时进行处理的函数
function newDragZone(dragZoneID, dragZoneInfoID, fileInputID, fileTypes) {
    const dragZone = document.getElementById(dragZoneID);
    const dragZoneInfo = document.getElementById(dragZoneInfoID);
    const fileInput = document.getElementById(fileInputID);

    console.log(`初始化拖拽区域: ${dragZoneID}, 对应input: ${fileInputID}`);

    // 拖放视觉反馈
    dragZone.addEventListener("dragover", (e) => {
        e.preventDefault();
        dragZone.style.border = "2px solid var(--hColor, darkblue)";
    });
    
    dragZone.addEventListener("dragleave", () => {
        dragZone.style.border = "2px dashed var(--hrColor, #6a6a6a)";
    });

    // 点击选择文件
    dragZone.addEventListener("click", () => {
        console.log(`点击 ${dragZoneID}，触发文件选择`);
        fileInput.click();
    });
    
    fileInput.addEventListener("change", e => {
        console.log(`input ${fileInputID} 变化，文件:`, e.target.files[0]?.name);
        showFileInfo(e.target.files[0], dragZoneInfo, fileTypes, fileInput);
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
        console.log(`拖拽文件到 ${dragZoneID}`);
        const file = e.dataTransfer.files[0];
        droppedFile = file;
        
        if (file) {
            console.log(`拖拽的文件: ${file.name}, 类型: ${file.type}, 大小: ${file.size}字节`);
            
            // 显示文件信息
            showFileInfo(file, dragZoneInfo, fileTypes, fileInput);
            
            // 🔥 关键修复：将文件同步到 input 元素
            syncFileToInput(file, fileInput);
            
            dragZone.style.border = "2px solid var(--hColor, darkblue)";
        } else {
            console.warn("拖拽但没有获取到文件");
        }
    });
}

// 将 File 对象同步到 input 元素的函数
function syncFileToInput(file, fileInput) {
    if (!file || !fileInput) {
        console.warn("syncFileToInput: 文件或input为空");
        return false;
    }
    
    try {
        // 创建一个新的 DataTransfer 对象
        const dataTransfer = new DataTransfer();
        
        // 添加文件到 DataTransfer
        dataTransfer.items.add(file);
        
        // 将 DataTransfer 的文件列表赋值给 input
        fileInput.files = dataTransfer.files;
        
        console.log(`✅ 文件同步成功: ${file.name} -> ${fileInput.id}`);
        
        // 触发 change 事件（确保其他监听器能捕获）
        const changeEvent = new Event('change', { bubbles: true });
        fileInput.dispatchEvent(changeEvent);
        
        return true;
    } catch (error) {
        console.error('❌ 同步文件到 input 失败:', error);
        return false;
    }
}

// 文件类型信息
const fileTypeNameData = {
    // 文档类型
    "application/pdf": "PDF文档",
    "application/msword": "Word文档",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "Word文档",
    "application/vnd.ms-excel": "Excel表格",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "Excel表格",
    "application/vnd.ms-powerpoint": "PowerPoint演示",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation": "PowerPoint演示",
    "text/plain": "文本文件",
    "text/csv": "CSV表格",
    "text/html": "HTML文件",
    "application/json": "JSON",
    "application/xml": "XML文件",

    // 图片类型
    "image/jpeg": "JPEG图片",
    "image/jpg": "JPEG图片",
    "image/png": "PNG图片",
    "image/gif": "GIF图片",
    "image/webp": "WebP图片",
    "image/svg+xml": "SVG矢量图",
    "image/bmp": "BMP图片",
    "image/tiff": "TIFF图片",
    "image/x-icon": "图标文件",

    // 视频类型
    "video/mp4": "MP4视频",
    "video/mpeg": "MPEG视频",
    "video/quicktime": "MOV视频",
    "video/x-msvideo": "AVI视频",
    "video/x-matroska": "MKV视频",
    "video/webm": "WebM视频",
    "video/x-flv": "Flash视频",

    // 音频类型
    "audio/mpeg": "MP3音频",
    "audio/wav": "WAV音频",
    "audio/ogg": "OGG音频",
    "audio/aac": "AAC音频",
    "audio/flac": "FLAC音频",
    "audio/webm": "WebM音频",
    "audio/x-m4a": "M4A音频",

    // 压缩文件
    "application/zip": "ZIP压缩包",
    "application/x-zip-compressed": "ZIP压缩包",
    "application/x-rar-compressed": "RAR压缩包",
    "application/x-7z-compressed": "7Z压缩包",
    "application/x-tar": "TAR压缩包",
    "application/gzip": "GZIP压缩包",

    // 编程文件
    "application/javascript": "JavaScript文件",
    "application/x-javascript": "JavaScript文件",
    "text/javascript": "JavaScript文件",
    "text/css": "CSS样式表",
    "text/x-python": "Python脚本",
    "application/x-httpd-php": "PHP脚本",
    "text/x-java-source": "Java源文件",
    "text/x-c": "C源文件",
    "text/x-c++": "C++源文件",

    // 其他常见类型
    "application/octet-stream": "二进制文件",
    "application/x-binary": "二进制文件",
    "application/x-msdownload": "可执行文件",
    "application/vnd.android.package-archive": "APK安装包",
    "application/x-apple-diskimage": "DMG镜像",

    // 字体文件
    "font/ttf": "TrueType字体",
    "font/otf": "OpenType字体",
    "font/woff": "WOFF字体",
    "font/woff2": "WOFF2字体",
}

function showFileInfo(file, dragZoneInfo, fileTypes, fileInput) {
    console.log("showFileInfo 被调用，文件:", file?.name);
    
    if (file) {
        const fileData = {
            name: file.name,
            type: file.type,
            size: parseFloat((file.size / 1024).toFixed(2)) //转换到KiB
        }
        
        console.log(`文件信息: 名称=${fileData.name}, 类型=${fileData.type}, 大小=${fileData.size}KiB`);
        console.log(`允许的类型: ${fileTypes}`);

        // 检查文件类型是否允许
        const isTypeAllowed = fileTypes.includes(fileData.type);
        console.log(`文件类型检查: ${isTypeAllowed ? '✅ 允许' : '❌ 不允许'}`);

        if (isTypeAllowed) {
            dragZoneInfo.innerText = `文件：${fileData.name}，大小：${fileData.size}KiB`;
            dragZoneInfo.classList.remove("dragZoneInfoDefault");
            dragZoneInfo.classList.remove("dragZoneInfoError");
            dragZoneInfo.classList.add("dragZoneInfoActive");
            
            // 🔥 如果是通过 showFileInfo 直接调用（不是通过input change事件），同步到input
            if (fileInput && (!fileInput.files || fileInput.files.length === 0)) {
                console.log("通过 showFileInfo 同步文件到 input");
                syncFileToInput(file, fileInput);
            }
        } else {
            // 尝试获取类型名称
            const typeName = fileTypeNameData[fileData.type] || fileData.type;
            dragZoneInfo.innerText = `不支持的文件类型: ${typeName}`;
            dragZoneInfo.classList.remove("dragZoneInfoDefault");
            dragZoneInfo.classList.remove("dragZoneInfoActive");
            dragZoneInfo.classList.add("dragZoneInfoError");
            
            // 清除错误的文件
            if (fileInput) {
                fileInput.value = ''; // 清空input
            }
        }
    } else {
        dragZoneInfo.innerText = "点击或拖拽文件到此处~";
        dragZoneInfo.classList.remove("dragZoneInfoActive");
        dragZoneInfo.classList.remove("dragZoneInfoError");
        dragZoneInfo.classList.add("dragZoneInfoDefault");
        console.log("文件为空，重置显示");
    }
}

// 导出函数供其他脚本使用
window.newDragZone = newDragZone;
window.showFileInfo = showFileInfo;
window.syncFileToInput = syncFileToInput;