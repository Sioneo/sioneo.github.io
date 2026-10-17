// 储存了一些状态
var generalData = {
    animationDialog: {
        hasAddedListenerToSubmitButton: false,  // 标记是否已为添加动画对话框的提交按钮添加监听器
        currentInnerId: null // 现在正在操作内容的内部id
    },
    animationFrameDialog: {
        hasAddedListenerToSubmitButton: false,
        currentInnerId: null
    },
    pluginManifestDialog: {
        hasAddedListenerToSubmitButton: false,
        currentInnerId: null
    },
    influenceDialog: {
        hasAddedListenerToSubmitButton: false,
        currentInnerId: null
    },
    projectName: null,
    currentMode: null // rci或者服务类service (弃用)
}

// 记录了不同类型的不可用属性
var typeValueData = {
    rci: [
        "monthly price"
    ],
    service: [

    ]
}

// 储存最后输出的json数据
var jsonData = {
    rci: { json: {}, resource: [] }
}

// 暂存帧和动画导入时的json数据
var imageData = {
    rci: { frames: {}, animation: {} }
}

// 存储影响输入数据
var influenceInputData = {

}

// 随机ID服务
function randomId(target) {
    let prefix = "";
    let uuid = crypto.randomUUID().substring(0, 11);
    switch (target) {
        case "building":
            break;
        case "animation":
            prefix = "animation-";
            break;
        case "manifest":
            prefix = "manifest-";
            break;
        default:
            prefix = "default-";
            Web.throwError("发生错误");
            break;
    }

    if (generalData.projectName) {
        prefix = generalData.projectName + "-" + prefix;
    } else if (target == "building") {
        uuid = crypto.randomUUID(); // 没项目名时使用更长的uuid
    } else {

    }

    return `$${prefix}${uuid}`
}