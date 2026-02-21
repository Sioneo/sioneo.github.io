// 储存了一些状态
var generalData = {
    animationDialog: {
        hasAddedListenerToSubmitButton: false  // 标记是否已为添加动画对话框的提交按钮添加监听器
    },
    animationFrameDialog: {
        hasAddedListenerToSubmitButton: false  // 标记是否已为添加动画帧对话框的提交按钮添加监听器
    },
    pluginManifestDialog: {
        hasAddedListenerToSubmitButton: false
    },
    projectName: null
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