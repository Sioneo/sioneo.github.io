// 储存最后输出的json数据
let jsonData = {
    rci: { json: {}, resource: [] }
}

// 暂存帧和动画导入时的json数据
let imageData = {
    rci: { frames: {}, animation: {} }
}

let influenceInputData = {

}

/**
 * 显示“添加新动画”对话框，并在提交时执行回调函数
 * @param {Function} callback - 用户提交后执行的回调，接收包含id和night字段的对象
 */
function showAddNewAnimationDialog(callback) {
    let dialog = document.getElementById("add-new-animation-dialog");
    let submitButton = document.getElementById("new-animation-submit-button");
    dialog.showModal();
    console.log("打开添加新动画对话框"); // 日志：对话框打开

    // 避免重复添加事件监听器
    if (!generalData.animationDialog.hasAddedListenerToSubmitButton) {
        submitButton.addEventListener("click", function () {
            console.log("用户提交新动画表单"); // 日志：用户点击提交
            let result = {};
            let form = new FormData(document.getElementById("new-animation-form"));
            result.id = form.get("id");
            result.night = form.has("night");
            result["rotation aware"] = form.has("rotation aware");

            if (result.id) {
                console.log("动画ID有效，调用回调", result); // 日志：有效数据
                callback(result);
            } else {
                Web.throwError("未输入ID");
                console.warn("用户未输入动画ID"); // 日志：警告
            }
        });
        generalData.animationDialog.hasAddedListenerToSubmitButton = true;
        console.log("已为添加动画对话框添加提交监听器"); // 日志：监听器添加
    }
}

/**
 * 显示“添加新动画帧”对话框，并在提交时执行回调函数
 * @param {Function} callback - 用户提交后执行的回调，接收包含image, handleX, handleY的对象
 */
function showAddAnimationFrameDialog(callback) {
    let dialog = document.getElementById("add-new-animation-frame-dialog");
    let submitButton = document.getElementById("new-animation-frame-submit-button");
    dialog.showModal();
    console.log("打开添加动画帧对话框"); // 日志：对话框打开

    if (!generalData.animationFrameDialog.hasAddedListenerToSubmitButton) {
        submitButton.addEventListener("click", function () {
            console.log("用户提交新动画帧表单"); // 日志：用户点击提交
            let result = {};
            let form = new FormData(document.getElementById("new-animation-frame-form"));
            result.image = document.getElementById("animation-frame-image-input").files[0];
            result.handleX = parseInt(form.get("handle-x"));
            result.handleY = parseInt(form.get("handle-y"));
            console.log("动画帧数据：", result); // 日志：输出收集到的数据
            callback(result);
        });
        generalData.animationFrameDialog.hasAddedListenerToSubmitButton = true;
        console.log("已为添加动画帧对话框添加提交监听器"); // 日志：监听器添加
    }
}

/**
 * 向指定动画添加新帧（根据模式决定操作RCI还是service）
 * @param {string} mode - 模式，目前仅支持"rci"
 * @param {string} animationId - 要添加帧的动画ID
 */
function addNewFrameToAnimation(mode, animationId) {
    console.log(`调用addNewFrameToAnimation，模式：${mode}，动画ID：${animationId}`); // 日志：函数调用
    switch (mode) {
        case "rci":
            showAddAnimationFrameDialog(function (data) {
                console.log("添加动画帧回调执行", data); // 日志：回调开始
                // 处理数据的代码
                if (!data.image) {
                    Web.throwError("输入不正确");
                    console.warn("用户未选择图片文件"); // 日志：警告
                    return;
                }

                let frameId = "$" + crypto.randomUUID().substring(0, 7);
                let result = {
                    json: {
                        bmp: data.image.name,
                        "handle x": Number.isNaN(data.handleX) ? null : data.handleX,
                        "handle y": Number.isNaN(data.handleY) ? null : data.handleY
                    },
                    resource: {
                        image: data.image
                    }
                };

                // 存储到imageData
                imageData.rci.animation[animationId].frames[frameId] = result;
                console.log(`已为动画${animationId}添加帧${frameId}`, result); // 日志：存储成功

                // 创建显示元素
                let para = document.createElement("p");
                para.innerHTML = `帧: ${data.image.name}<br>handle x: ${!data.handleX ? "null（空）" : data.handleX}
                &emsp;&emsp;handle y: ${!data.handleY ? "null（空）" : data.handleY}&emsp;&emsp;
                <button class="button-small" onclick="deleteAnimationFrame('rci', '${animationId}', '${frameId}')">删除</button>`;
                para.id = "para" + frameId;
                para.style = "padding-left: 3em";

                document.getElementById("container" + animationId).appendChild(para);
                console.log(`已将帧显示元素添加到页面容器container${animationId}`); // 日志：UI更新
            });
            break;
        default:
            Web.throwError("未指定模式");
            console.error(`无效模式：${mode}`); // 日志：错误
            break;
    }
}

/**
 * 删除指定动画（包括其所有帧）
 * @param {string} mode - 模式
 * @param {string} id - 动画ID
 */
function deleteAnimation(mode, id) {
    console.log(`调用deleteAnimation，模式：${mode}，动画ID：${id}`); // 日志：函数调用
    switch (mode) {
        case "rci":
            imageData.rci.animation[id] = null;
            document.getElementById("para" + id).remove();
            document.getElementById("container" + id).remove();
            console.log(`已删除动画${id}及其容器和段落元素`); // 日志：删除成功
            break;
        case "service":
            // TODO: 实现service模式
            console.warn("service模式尚未实现"); // 日志：未实现
            break;
        default:
            Web.throwError("未指定删除模式");
            console.error(`无效删除模式：${mode}`); // 日志：错误
            break;
    }
}

/**
 * 删除指定动画中的一帧
 * @param {string} mode - 模式
 * @param {string} animationId - 动画ID
 * @param {string} frameId - 帧ID
 */
function deleteAnimationFrame(mode, animationId, frameId) {
    console.log(`调用deleteAnimationFrame，模式：${mode}，动画ID：${animationId}，帧ID：${frameId}`); // 日志：函数调用
    switch (mode) {
        case "rci":
            delete imageData.rci.animation[animationId].frames[frameId];
            document.getElementById("para" + frameId).remove();
            console.log(`已从动画${animationId}中删除帧${frameId}`); // 日志：删除成功
            break;
        case "service":
            // TODO: 实现service模式
            console.warn("service模式尚未实现"); // 日志：未实现
            break;
        default:
            Web.throwError("未指定删除模式");
            console.error(`无效删除模式：${mode}`); // 日志：错误
            break;
    }
}

/**
 * 删除一个独立帧（非动画中的帧）
 * @param {string} mode - 模式
 * @param {string} id - 帧ID
 */
function deleteFrame(mode, id) {
    console.log(`调用deleteFrame，模式：${mode}，帧ID：${id}`); // 日志：函数调用
    switch (mode) {
        case "rci":
            delete imageData.rci.frames[id];
            document.getElementById("para" + id).remove();
            console.log(`已删除独立帧${id}`); // 日志：删除成功
            break;
        case "service":
            // TODO: 实现service模式
            console.warn("service模式尚未实现"); // 日志：未实现
            break;
        default:
            Web.throwError("未指定删除模式");
            console.error(`无效删除模式：${mode}`); // 日志：错误
            break;
    }
}

// 删除影响
function deleteInfluence(id) {
    delete influenceInputData[id];
    document.getElementById("para" + id).remove();
}

// 监听“添加动画”按钮点击事件
document.getElementById("animation-add-button").addEventListener("click", function () {
    console.log("用户点击了添加动画按钮"); // 日志：用户操作
    // 添加一个新的空动画
    showAddNewAnimationDialog(function (data) {
        console.log("添加动画回调执行", data); // 日志：回调开始
        let id = "$" + crypto.randomUUID().substring(0, 7);
        imageData.rci.animation[id] = {
            id: data.id,
            type: "animation",
            light: data.night,
            "light switching": data.night,
            "rotation aware": data["rotation aware"],
            frames: {}
        };
        console.log(`已创建新动画，内部ID：${id}，用户ID：${data.id}`); // 日志：动画创建

        const container = document.createElement("div");
        const para = document.createElement("p");
        para.innerHTML = `<hr class="narrow"><div style="display: flex; justify-content: space-between;">
        <div>动画&emsp;&emsp;ID: ${data.id}&emsp;&emsp;</div>
        <div>夜景: ${data.night ? "是" : "否"}&emsp;&emsp;旋转感知: ${data["rotation aware"] ? "是" : "否"}&emsp;&emsp;<button class="button-small" onclick="addNewFrameToAnimation('rci', '${id}')">添加帧</button>
    &emsp;<button class="button-small" onclick="deleteAnimation('rci', '${id}')">删除</button>&emsp;</div>`;
        container.id = "container" + id;
        para.id = "para" + id;
        container.appendChild(para);

        // 如果当前在RCI标签页，则添加到展示区
        if (webData.navBar.active == "RCI") {
            document.getElementById("rci-animation-showcase").appendChild(container);
            console.log(`已将动画容器添加到RCI动画展示区`); // 日志：UI更新
        } else {
            console.log("当前不在RCI标签页，动画容器未添加"); // 日志：未添加
        }
    });
});

// 监听“添加帧”按钮点击事件（独立帧）
document.getElementById("frames-add-button").addEventListener("click", function () {
    console.log("用户点击了添加独立帧按钮"); // 日志：用户操作
    document.getElementById("add-new-frames-dialog").showModal();
    console.log("打开添加独立帧对话框"); // 日志：对话框打开
});

// 监听独立帧对话框的提交按钮
document.getElementById("new-frames-submit-button").addEventListener("click", function () {
    console.log("用户提交独立帧表单"); // 日志：用户操作
    const form = new FormData(document.getElementById("new-frames-form"));
    const image = document.getElementById("frames-image-input").files[0];
    const raw = { x: parseInt(form.get("handle x"), 10), y: parseInt(form.get("handle y"), 10) };
    const handleX = Number.isNaN(raw.x) ? null : raw.x;
    const handleY = Number.isNaN(raw.y) ? null : raw.y;

    if (image) {
        let id = "$" + crypto.randomUUID().substring(0, 7);
        const infoPara = document.createElement("p");
        infoPara.innerHTML = `<hr class="narrow">
        <div style="display: flex; justify-content: space-between;">
        <div>${image.name}&emsp;&emsp;<b>handle x</b>: ${!handleX ? "空(null)" : handleX}&emsp;&emsp;<b>handle y</b>: ${!handleY ? "空(null)" : handleY}&emsp;&emsp;</div>
        <div><button class="button-small" onclick="deleteFrame('rci', '${id}')">删除</button></div>
        </div>`;
        infoPara.id = "para" + id;

        switch (webData.navBar.active) {
            case "RCI":
                let result = {
                    json: {
                        bmp: image.name,
                        "handle x": handleX,
                        "handle y": handleY
                    },
                    resource: {
                        image: image
                    }
                };
                imageData.rci.frames[id] = result;
                document.getElementById("rci-frames-showcase").appendChild(infoPara);
                console.log(`已添加独立帧${id}到RCI，图片：${image.name}`); // 日志：添加成功
                break;
            case "service":
                // TODO: 实现service模式
                console.warn("service模式尚未实现"); // 日志：未实现
                break;
            default:
                console.warn(`未知导航标签：${webData.navBar.active}`); // 日志：未知标签
                break;
        }
    } else {
        Web.throwError("未导入文件");
        console.warn("用户未选择图片文件"); // 日志：警告
    }
});


// 影响
document.getElementById("influence-add-button").addEventListener("click", function () {
    document.getElementById("influence-dialog").showModal();

    if (!generalData.influenceDialog.hasAddedListenerToSubmitButton) {
        document.getElementById("influence-submit-button").addEventListener("click", function () {
            const form = new FormData(document.getElementById("influence-form"));
            const typ = form.get("type");
            const value = form.get("value");

            let id = "$" + crypto.randomUUID().substring(0, 7);
            influenceInputData[id] = {typ: typ, value: value};

            let para = document.createElement("p");
            para.innerHTML = `<hr class="narrow"><div style="display: flex; justify-content: space-between">
            <div>影响&emsp;&emsp;${Web.getSelectTextByValue("influence-type", typ)}&emsp;&emsp;数值：${value}</div>
            <div><button class="button-small" onclick="deleteInfluence('${id}')">删除</button></div>
            </div>`;
            para.id = "para" + id;

            document.getElementById("influence-showcase").appendChild(para);
        })
        generalData.influenceDialog.hasAddedListenerToSubmitButton = true;
    }
})


// 监听主提交按钮（最终导出数据）
document.getElementById("main-submit-button").addEventListener("click", function () {
    console.log("用户点击了主提交按钮"); // 日志：用户操作
    // 初始化对象
    jsonData = {
        rci: { json: {}, resource: [] },
        service: { json: {}, resource: [] }
    };
    console.log("已重置jsonData"); // 日志：重置

    switch (webData.navBar.active) {
        case "RCI":
            let basicData = Object.fromEntries(new FormData(document.getElementById("rci-basic-data-form")));
            basicData.type = basicData.type.replace(/\$/g, "");// 去除用于区分小学教育和高等教育的$符号（如果有）
            let advancedData = Object.fromEntries(new FormData(document.getElementById("rci-advanced-data-form")));
            checkForm(document.getElementById("rci-basic-data-form"), function (result) {
                if (!result) {
                    Web.throwError("表单验证未通过");
                    return;
                }
            });
            console.log("收集的RCI基础数据：", basicData); // 日志：基础数据
            console.log("收集的RCI高级数据：", advancedData); // 日志：高级数据

            let framesData = [];
            // 收集帧的数据
            if (Object.keys(imageData.rci.frames).length === 0) {
                Web.throwError("未导入帧");
                return;
            } else {
                let allFrames = imageData.rci.frames;
                for (let key in allFrames) {
                    let frame = allFrames[key];
                    framesData.push(frame.json);
                    jsonData.rci.resource.push(frame.resource.image);
                }
            }

            let allAnimations = imageData.rci.animation;
            let animationData = [];
            for (let key in allAnimations) {
                let animation = allAnimations[key];
                let animationFrames = animation.frames;
                let result = {
                    id: animation.id,
                    type: animation.type,
                    light: animation.light,
                    "light switching": animation["light switching"],
                    "rotaton aware": animation["rotation aware"],
                    frames: []
                }
                if (Object.keys(animationFrames).length === 0) {
                    Web.throwError(`动画${animation.id}没有导入帧`)
                    break;
                } else {
                    for (let k in animationFrames) {
                        result.frames.push(animationFrames[k].json);
                        jsonData.rci.resource.push(animationFrames[k].resource.image);

                        if (!basicData.animation) {
                            basicData.animation = []
                        }
                        basicData.animation.push({ id: animation.id })
                    }
                    animationData.push(result);
                }
            }

            // 水电
            let water = document.getElementById("water-input").value;
            let power = document.getElementById("power-input").value;
            basicData.water = Nunber.isNaN(water)? null: water;
            basicData.power = Nunber.isNaN(power)? null: power;
            // 影响
            for (let id in influenceInputData) {
                let influence = influenceInputData[id];
                basicData[influence.typ] = influence.value;
            }

            // 最后的数据整合
            jsonData.rci.json = [{ ...validateFormData(basicData), ...validateFormData(advancedData) }];
            jsonData.rci.json[0].frames = framesData;
            jsonData.rci.json = animationData.concat(jsonData.rci.json);

            // 呈现JSON代码
            let jsonOutputShowcase = document.getElementById("json-output");
            jsonOutputShowcase.textContent = JSON.stringify(jsonData.rci.json, null, 2);
            break;
        default:
            Web.throwError("整理数据时发生错误")
            break;
    }

});