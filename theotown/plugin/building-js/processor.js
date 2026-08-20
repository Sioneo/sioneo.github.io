/**
 * 显示“添加新动画”对话框，并在提交时执行回调函数
 * @param {Function} callback - 用户提交后执行的回调，接收包含id和night字段的对象
 */
function showAddNewAnimationDialog(callback) {
    let dialog = document.getElementById("add-new-animation-dialog");
    let submitButton = document.getElementById("new-animation-submit-button");
    dialog.showModal();
    console.log(`[对话框] 打开添加新动画对话框`); // 日志：对话框打开

    // 避免重复添加事件监听器
    if (!generalData.animationDialog.hasAddedListenerToSubmitButton) {
        submitButton.addEventListener("click", function () {
            console.log(`[用户操作] 点击提交新动画表单`); // 日志：用户点击提交
            let result = {};
            let form = new FormData(document.getElementById("new-animation-form"));
            result.id = form.get("id");
            result.night = form.has("night");
            result["rotation aware"] = form.has("rotation aware");

            if (result.id) {
                console.log(`[数据验证] 动画ID有效: ${result.id}`, result); // 日志：有效数据
                callback(result);
            } else {
                Web.throwError("未输入ID");
                console.warn(`[验证警告] 用户未输入动画ID`); // 日志：警告
            }
        });
        generalData.animationDialog.hasAddedListenerToSubmitButton = true;
        console.log(`[初始化] 已为添加动画对话框添加提交监听器`); // 日志：监听器添加
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
    console.log(`[对话框] 打开添加动画帧对话框`); // 日志：对话框打开

    if (!generalData.animationFrameDialog.hasAddedListenerToSubmitButton) {
        submitButton.addEventListener("click", function () {
           console.log(`[用户操作] 点击提交新动画帧表单`); // 日志：用户点击提交
            let result = {};
            let form = new FormData(document.getElementById("new-animation-frame-form"));
            result.image = document.getElementById("animation-frame-image-input").files[0];
            result.handleX = parseInt(form.get("handle-x"));
            result.handleY = parseInt(form.get("handle-y"));
            console.log(`[数据收集] 动画帧数据:`, {
                imageName: result.image?.name,
                handleX: result.handleX,
                handleY: result.handleY
            }); // 日志：输出收集到的数据
            callback(result);
        });
        generalData.animationFrameDialog.hasAddedListenerToSubmitButton = true;
        console.log(`[初始化] 已为添加动画帧对话框添加提交监听器`); // 日志：监听器添加
    }
}

/**
 * 向指定动画添加新帧（根据模式决定操作RCI还是service）
 * @param {string} mode - 模式，目前仅支持"rci"
 * @param {string} animationId - 要添加帧的动画ID
 */
function addNewFrameToAnimation() {
    showAddAnimationFrameDialog(function (data) {
        let animationId = generalData.animationFrameDialog.currentInnerId;
        console.log(`[函数调用] addNewFrameToAnimation，动画ID：${animationId}`); // 日志：函数调用
        
        console.log(`[回调执行] 添加动画帧回调开始`, data); // 日志：回调开始
        
        if (!data.image) {
            Web.throwError("输入不正确");
            console.warn(`[验证警告] 用户未选择图片文件`); // 日志：警告
            return;
        }

        let frameId = "$" + crypto.randomUUID().substring(0, 7);
        console.log(`[生成ID] 为新帧生成ID: ${frameId}`); // 日志：生成帧ID
        
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
        if (!imageData.rci.animation[animationId].frames) {
            imageData.rci.animation[animationId].frames = {}
            console.log(`[数据结构] 为动画${animationId}初始化frames对象`); // 日志：初始化帧容器
        }
        imageData.rci.animation[animationId].frames[frameId] = result;
        console.log(`[数据存储] 已为动画${animationId}添加帧${frameId}`, {
            imageName: data.image.name,
            handleX: result.json["handle x"],
            handleY: result.json["handle y"]
        }); // 日志：存储成功

        // 创建显示元素
        let para = document.createElement("p");
        para.innerHTML = `帧: ${data.image.name}<br>handle x: ${!data.handleX ? "null（空）" : data.handleX}
                &emsp;&emsp;handle y: ${!data.handleY ? "null（空）" : data.handleY}&emsp;&emsp;
                <button class="button-small" onclick="deleteAnimationFrame('${animationId}', '${frameId}')">删除</button>`;
        para.id = "para" + frameId;
        para.style = "padding-left: 3em";

        document.getElementById("container" + animationId).appendChild(para);
        console.log(`[UI更新] 已将帧显示元素添加到页面容器container${animationId}`); // 日志：UI更新
    });

}

/**
 * 删除指定动画（包括其所有帧）
 * @param {string} mode - 模式
 * @param {string} id - 动画ID
 */
function deleteAnimation(mode, id) {
    console.log(`[函数调用] deleteAnimation，模式：${mode}，动画ID：${id}`); // 日志：函数调用

    delete imageData.rci.animation[id];
    document.getElementById("para" + id).remove();
    document.getElementById("container" + id).remove();
    console.log(`[删除操作] 已删除动画${id}及其容器和段落元素`); // 日志：删除成功
}

/**
 * 删除指定动画中的一帧
 * @param {string} mode - 模式
 * @param {string} animationId - 动画ID
 * @param {string} frameId - 帧ID
 */
function deleteAnimationFrame(animationId, frameId) {
    console.log(`[函数调用] deleteAnimationFrame，动画ID：${animationId}，帧ID：${frameId}`); // 日志：函数调用
    
    if (imageData.rci.animation[animationId]?.frames[frameId]) {
        delete imageData.rci.animation[animationId].frames[frameId];
        document.getElementById("para" + frameId).remove();
        console.log(`[删除操作] 已从动画${animationId}中删除帧${frameId}`); // 日志：删除成功
    } else {
        console.warn(`[删除警告] 尝试删除不存在的帧: 动画${animationId}中的帧${frameId}`); // 日志：删除失败警告
    }
}

/**
 * 删除一个独立帧（非动画中的帧）
 * @param {string} mode - 模式
 * @param {string} id - 帧ID
 */
function deleteFrame(id) {
    console.log(`[函数调用] deleteFrame 帧ID：${id}`); // 日志：函数调用

    if (imageData.rci.frames[id]) {
        delete imageData.rci.frames[id];
        document.getElementById("para" + id).remove();
        console.log(`[删除操作] 已删除独立帧${id}`); // 日志：删除成功
    } else {
        console.warn(`[删除警告] 尝试删除不存在的独立帧: ${id}`); // 日志：删除失败警告
    }
}

/**
 * 删除影响数据
 * @param {string} id - 影响数据的ID
 */
function deleteInfluence(id) {
    console.log(`[函数调用] deleteInfluence 影响ID：${id}`); // 日志：函数调用
    
    if (influenceInputData[id]) {
        delete influenceInputData[id];
        document.getElementById("para" + id).remove();
        console.log(`[删除操作] 已删除影响数据${id}`); // 日志：删除成功
    } else {
        console.warn(`[删除警告] 尝试删除不存在的影响数据: ${id}`); // 日志：删除失败警告
    }
}

// 监听“添加动画”按钮点击事件
document.getElementById("animation-add-button").addEventListener("click", function () {
    console.log(`[用户操作] 点击了添加动画按钮`); // 日志：用户操作
    
    // 添加一个新的空动画
    showAddNewAnimationDialog(function (data) {
        console.log(`[回调执行] 添加动画回调开始`, data); // 日志：回调开始
        
        let id = "$" + crypto.randomUUID().substring(0, 7);
        console.log(`[生成ID] 为新动画生成内部ID: ${id}`); // 日志：生成动画ID
        
        imageData.rci.animation[id] = {
            id: data.id,
            type: "animation",
            light: data.night,
            "light switching": data.night,
            "rotation aware": data["rotation aware"],
            frames: {}
        };
        console.log(`[数据存储] 已创建新动画，内部ID：${id}，显示ID：${data.id}`, {
            night: data.night,
            rotationAware: data["rotation aware"]
        }); // 日志：动画创建

        const container = document.createElement("div");
        const para = document.createElement("p");
        para.innerHTML = `<div style="display: flex; justify-content: space-between;">
        <div>动画&emsp;&emsp;ID: ${data.id}&emsp;&emsp;</div>
        <div>夜景: ${data.night ? "是" : "否"}&emsp;&emsp;旋转感知: ${data["rotation aware"] ? "是" : "否"}&emsp;&emsp;
        <button class="button-small" onclick="generalData.animationFrameDialog.currentInnerId = '${id}'; addNewFrameToAnimation()">添加帧</button>
    &emsp;<button class="button-small" onclick="deleteAnimation('rci', '${id}')">删除</button></div>
    <hr class="narrow">`;
        container.id = "container" + id;
        para.id = "para" + id;
        container.appendChild(para);

        document.getElementById("rci-animation-showcase").appendChild(container);
        console.log(`[UI更新] 已将动画容器添加到RCI动画展示区，容器ID: container${id}`); // 日志：UI更新
    });
});

// 监听“添加帧”按钮点击事件（独立帧）
document.getElementById("frames-add-button").addEventListener("click", function () {
    console.log(`[用户操作] 点击了添加独立帧按钮`); // 日志：用户操作
    
    document.getElementById("add-new-frames-dialog").showModal();
    console.log(`[对话框] 打开添加独立帧对话框`); // 日志：对话框打开
});

// 监听独立帧对话框的提交按钮
document.getElementById("new-frames-submit-button").addEventListener("click", function () {
    console.log(`[用户操作] 提交独立帧表单`); // 日志：用户操作
    
    const form = new FormData(document.getElementById("new-frames-form"));
    const image = document.getElementById("frames-image-input").files[0];
    const raw = { x: parseInt(form.get("handle x"), 10), y: parseInt(form.get("handle y"), 10) };
    const handleX = Number.isNaN(raw.x) ? null : raw.x;
    const handleY = Number.isNaN(raw.y) ? null : raw.y;

    console.log(`[数据收集] 独立帧表单数据:`, {
        imageName: image?.name,
        handleX: handleX,
        handleY: handleY
    }); // 日志：收集的数据

    if (image) {
        let id = "$" + crypto.randomUUID().substring(0, 7);
        console.log(`[生成ID] 为新独立帧生成ID: ${id}`); // 日志：生成帧ID
        
        const infoPara = document.createElement("p");
        infoPara.innerHTML = `<div style="display: flex; justify-content: space-between;">
        <div>${image.name}&emsp;&emsp;<b>handle x</b>: ${!handleX ? "空(null)" : handleX}&emsp;&emsp;<b>handle y</b>: ${!handleY ? "空(null)" : handleY}&emsp;&emsp;</div>
        <div><button class="button-small" onclick="deleteFrame('${id}')">删除</button></div>
        </div>
        <hr class="narrow">`;
        infoPara.id = "para" + id;

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
        console.log(`[数据存储] 已添加独立帧${id}到RCI，图片：${image.name}`); // 日志：添加成功
    } else {
        Web.throwError("未导入文件");
        console.warn(`[验证警告] 用户未选择图片文件`); // 日志：警告
    }
});

// 影响数据相关
document.getElementById("influence-add-button").addEventListener("click", function () {
    console.log(`[用户操作] 点击添加影响按钮`); // 日志：用户操作
    
    document.getElementById("influence-dialog").showModal();
    console.log(`[对话框] 打开影响对话框`); // 日志：对话框打开

    if (!generalData.influenceDialog.hasAddedListenerToSubmitButton) {
        document.getElementById("influence-submit-button").addEventListener("click", function () {
            console.log(`[用户操作] 提交影响表单`); // 日志：用户操作
            
            const form = new FormData(document.getElementById("influence-form"));
            const typ = form.get("type");
            const value = form.get("value");

            console.log(`[数据收集] 影响数据:`, { type: typ, value: value }); // 日志：收集的影响数据

            let id = "$" + crypto.randomUUID().substring(0, 7);
            console.log(`[生成ID] 为影响数据生成ID: ${id}`); // 日志：生成影响ID
            
            influenceInputData[id] = { typ: typ, value: value };

            let para = document.createElement("p");
            para.innerHTML = `<div style="display: flex; justify-content: space-between">
            <div>影响&emsp;&emsp;${Web.getSelectTextByValue("influence-type", typ)}&emsp;&emsp;数值：${value}</div>
            <div><button class="button-small" onclick="deleteInfluence('${id}')">删除</button></div>
            </div>
            <hr class="narrow">`;
            para.id = "para" + id;

            document.getElementById("influence-showcase").appendChild(para);
            console.log(`[UI更新] 已将影响数据添加到展示区`); // 日志：UI更新
        })
        generalData.influenceDialog.hasAddedListenerToSubmitButton = true;
        console.log(`[初始化] 已为影响对话框添加提交监听器`); // 日志：监听器添加
    }
})

// 监听主提交按钮（最终导出数据）
document.getElementById("main-submit-button").addEventListener("click", function () {
    console.log(`[用户操作] 点击主提交按钮`); // 日志：用户操作
    console.log(`[数据处理] 开始收集和整理所有数据`); // 日志：数据处理开始
    
    // 初始化对象
    jsonData = {
        rci: { json: {}, resource: [] },
        service: { json: {}, resource: [] }
    };
    console.log(`[初始化] 已重置jsonData`); // 日志：重置

    let basicData = Object.fromEntries(new FormData(document.getElementById("rci-basic-data-form")));
    let advancedData = Object.fromEntries(new FormData(document.getElementById("rci-advanced-data-form")));
    
    console.log(`[表单验证] 开始验证RCI基础表单`); // 日志：开始验证
    checkForm(document.getElementById("rci-basic-data-form"), function (result) {
        if (!result) {
            Web.throwError("表单验证未通过");
            console.error(`[验证错误] RCI基础表单验证失败`); // 日志：验证失败
            return;
        } else {
            console.log(`[表单验证] RCI基础表单验证通过`); // 日志：验证通过
        }
    });
    
    console.log(`[数据收集] RCI基础数据:`, basicData); // 日志：基础数据
    console.log(`[数据收集] RCI高级数据:`, advancedData); // 日志：高级数据

    let framesData = [];
    // 收集帧的数据
    if (Object.keys(imageData.rci.frames).length === 0) {
        Web.throwError("未导入帧");
        console.error(`[数据错误] 没有导入任何帧数据`); // 日志：错误
        return;
    } else {
        let allFrames = imageData.rci.frames;
        console.log(`[数据处理] 开始处理${Object.keys(allFrames).length}个独立帧`); // 日志：帧数量
        
        for (let key in allFrames) {
            let frame = allFrames[key];
            framesData.push(frame.json);
            jsonData.rci.resource.push(frame.resource.image);
            console.log(`[数据处理] 处理帧${key}:`, frame.json); // 日志：处理每个帧
        }
    }

    let allAnimations = imageData.rci.animation;
    let animationData = [];
    console.log(`[数据处理] 开始处理${Object.keys(allAnimations).length}个动画`); // 日志：动画数量
    
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
        
        console.log(`[数据处理] 处理动画${key} (显示ID: ${animation.id})，帧数量: ${Object.keys(animationFrames).length}`); // 日志：处理每个动画
        
        if (Object.keys(animationFrames).length === 0) {
            Web.throwError(`动画${animation.id}没有导入帧`)
            console.error(`[数据错误] 动画${animation.id}没有导入任何帧`); // 日志：错误
            break;
        } else {
            for (let k in animationFrames) {
                result.frames.push(animationFrames[k].json);
                jsonData.rci.resource.push(animationFrames[k].resource.image);
                console.log(`[数据处理] 动画${animation.id}添加帧${k}:`, animationFrames[k].json); // 日志：处理每个动画帧

                if (!basicData.animation) {
                    basicData.animation = []
                }
                basicData.animation.push({ id: animation.id })
            }
            animationData.push(result);
            animationData.push(result);
        }
    }

    // 水电数据
    let water = document.getElementById("water-input").value;
    let power = document.getElementById("power-input").value;
    basicData.water = Number.isNaN(water) ? null : water;
    basicData.power = Number.isNaN(power) ? null : power;
    console.log(`[数据处理] 水电数据:`, { water: basicData.water, power: basicData.power }); // 日志：水电数据
    
    // 影响数据
    console.log(`[数据处理] 开始处理${Object.keys(influenceInputData).length}个影响数据`); // 日志：影响数据数量
    for (let id in influenceInputData) {
        let influence = influenceInputData[id];
        basicData[influence.typ] = influence.value;
        console.log(`[数据处理] 添加影响数据:`, { id: id, type: influence.typ, value: influence.value }); // 日志：每个影响数据
    }

    // 最后的数据整合
    jsonData.rci.json = [{ ...validateFormData(basicData), ...validateFormData(advancedData) }];
    jsonData.rci.json[0].frames = framesData;
    jsonData.rci.json = animationData.concat(jsonData.rci.json);

    console.log(`[数据处理完成] 最终JSON数据结构:`, {
        动画数量: animationData.length,
        独立帧数量: framesData.length,
        资源数量: jsonData.rci.resource.length
    }); // 日志：数据处理完成统计

    // 呈现JSON代码
    let jsonOutputShowcase = document.getElementById("json-output");
    jsonOutputShowcase.textContent = JSON.stringify(jsonData.rci.json, null, 2);
    console.log(`[UI更新] JSON输出已更新`); // 日志：UI更新
});
