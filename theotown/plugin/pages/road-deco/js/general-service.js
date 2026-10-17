// 储存了一些状态
var generalData = {
    projectName: null,
}

function randomId(target) {
    let prefix = "";
    let uuid = crypto.randomUUID().substring(0, 11);
    switch (target) {
        case "road-deco":
            prefix = "road-deco-";
            break;
        case "animation":
            prefix = "animation-";
            break;
        case "manifest":
            prefix = "manifest-";
            break;
        default:
            break;
    }

    if (generalData.projectName && target != "inner") {
        prefix = generalData.projectName + "-" + prefix;
    } else if (target == "building") {
        uuid = crypto.randomUUID(); // 没项目名时使用更长的uuid
    } else {
    }
    return `$${prefix}${uuid}`
}