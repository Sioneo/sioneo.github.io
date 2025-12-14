function getValueType(value) {
    // 因为typeof返回number并且有对null值返回object，这里对整数型和浮点数以及null值进行特别检查
    let actualType = typeof value;
    if (actualType == "number" || value === null) {
        if (Math.ceil(value) === value) {
            actualType = "integer";
        } else if (Math.ceil(value) != value) {
            actualType = "float";
        } else if (value === null) {
            actualType = "null";
        }
    }
    // 对对象和数组进行区分
    if (actualType == "object") {
        if (Array.isArray(value)) {
            actualType = "array";
        }
    }

    return actualType;
}

// 检测数据类型，取值和范围限制的函数
function checkValueAvailability(targetValue, checkerDataObject) {
    let result = [];
    let isPass = true;

    // 检查数据类型
    const type = getValueType(targetValue);

    if (type == checkerDataObject.type) {
        result.push({ "type": "Pass", "message": `数据类型检测通过(${checkerDataObject.type})` })
    } else {
        result.push({ "type": "Warning", "message": `发现数据类型不正确，得到${type}，应是(${checkerDataObject.type})` });
        isPass = false;
    }

    // 检查数据范围
    if (checkerDataObject.restricted === true) {
        let value;
        switch (checkerDataObject.restrict_type) {
            case "number":
                value = parseInt(targetValue);
                if (value >= checkerDataObject.minimum && value <= checkerDataObject.maximum) {
                    result.push({ "type": "Pass", "message": `数据范围检测通过(${checkerDataObject.minimum}~${checkerDataObject.maximum})` })
                } else if (value < checkerDataObject.minimum) {
                    result.push({ "type": "Failure", "message": `发现数据过小，应>=${checkerDataObject.minimum}` });
                    isPass = false;
                } else if (value > checkerDataObject.maximum) {
                    result.push({ "type": "Failure", "message": `发现数据过大，应<=${checkerDataObject.maximum}` });
                    isPass = false;
                } else {
                    result.push({ "type": "Failure", "message": "检测数据范围过程中发生错误" });
                    isPass = false;
                }
                break;
            case "string":
                value = targetValue;
                const validValues = checkerDataObject.values;
                const isIncluded = validValues.includes(value);
                if (isIncluded === true) {
                    result.push({ "type": "Pass", "message": `数据范围检测通过(${value})` })
                } else if (isIncluded === false) {
                    result.push({ "type": "Failure", "message": `${value}未包含在(${validValues.toString()})中` });
                    isPass = false;
                }
                break;
            default:
                result.push({ "type": "skip", "message": "不需要检测数据范围" })
        }
    }

    return [result, isPass];
}

// 检查贴图的函数
function checkThisFrame(object, objectNumber) {
    let result = [];
    let isPass = true;

    const bmp = object.bmp;

    if (bmp) {
        if (bmp.length < 4) {
            isPass = false;
            result.push({ "type": "Failure", "message": `第${objectNumber}帧中bmp输入不正确` });
            if (bmp.slice(-4) != ".png") {
                result.push({ "type": "Failure", "message": `第${objectNumber}帧中bmp输入缺少.png后缀(${bmp}<span style="color: red"><b>.png</b></span>)` });
            }
        } else if (bmp.slice(-4) != ".png") {
            isPass = false;
            result.push({ "type": "Failure", "message": `第${objectNumber}帧中bmp输入缺少.png后缀(${bmp}<span style="color: red"><b>.png</b></span>)` });
        } else {
            result.push({ "type": "Pass", "message": `第${objectNumber}帧中bmp输入检测通过(${bmp})` });
            isPass = true;
        }
    } else {
        isPass = false;
        result.push({ "type": "Warning", "message": `发现在frames第${objectNumber}帧中bmp缺失` });
    }

    return [result, isPass];
}

// JSON检测的主函数
function checkJSON(targetData, checkerData) {
    let result = {};
    let json;
    if (Array.isArray(targetData) === true) {
        json = targetData[0];
    } else {
        json = targetData;
    }

    // 先检查必要的键值对
    let isRequirementPass = true;
    let requirementCheckResult = {};
    const requirement = checkerData.requires;
    for (let i = 0; i < Object.keys(requirement).length; i++) {
        let thisValueResult = [];

        // 如果是frames，执行另外的检查逻辑
        if (requirement[i].key == "frames") {
            if (json[requirement[i].key]) {
                // 检查类型
                let availabilityCheckResult = checkValueAvailability(json[requirement[i].key], requirement[i]);
                isRequirementPass = availabilityCheckResult[1];

                // 检查贴图
                let framesObject = json[requirement[i].key];
                for (j = 0; j < Object.keys(framesObject).length; j++) {
                    let thisFrameCheckResult = checkThisFrame(framesObject[j], j);
                    thisValueResult = thisValueResult.concat(thisFrameCheckResult[0]);
                    isRequirementPass = thisFrameCheckResult[1];
                }
                thisValueResult = thisValueResult.concat(availabilityCheckResult[0]);

                if (isRequirementPass === true) {
                    thisValueResult.push({ "type": "Pass", "message": `${requirement[i].key}检测通过` });
                } else {
                    thisValueResult.push({ "type": "Warning", "message": `${requirement[i].key}检测不通过` });
                }
            } else {
                thisValueResult.push({ "type": "Warning", "message": `发现${requirement[i].key}缺失` });
                isRequirementPass = false;
            }
        }

        else {
            // 其他键执行的逻辑
            if (json[requirement[i].key]) {
                let availabilityCheckResult = checkValueAvailability(json[requirement[i].key], requirement[i]);
                isRequirementPass = availabilityCheckResult[1];
                thisValueResult = thisValueResult.concat(availabilityCheckResult[0]);

                if (isRequirementPass === true) {
                    thisValueResult.push({ "type": "Pass", "message": `${requirement[i].key}检测通过` });
                } else {
                    thisValueResult.push({ "type": "Warning", "message": `${requirement[i].key}检测不通过` });
                }

                // 当键为id时检查是否包含$符号
                if (requirement[i].key == "id") {
                    if (json[requirement[i].key].startsWith("$") != true) {
                        thisValueResult.push({ "type": "Notification", "message": `id前未发现$符号（建议添加）` });
                    }
                }
            } else {
                thisValueResult.push({ "type": "Warning", "message": `发现${requirement[i].key}缺失` });
                isRequirementPass = false;
            }
        }

        requirementCheckResult[`${requirement[i].key}`] = thisValueResult;
    }
    result = Object.assign({}, result, requirementCheckResult);
    if (isRequirementPass === false) {
        return result; // 若必要键值对检查不通过则直接跳出函数
    }

    // 检查其它键值对
    let mainCheckResult = {};
    const main = checkerData.main;
    for (let i = 0; i < Object.keys(main).length; i++) {
        let thisValueResult = [];
        // 检查该键是否存在
        let target = json[main[i].key];


        //　对影响的检查
        if (main[i].key == "influence") {
            // 获取原JSON代码中的影响数据
            let influenceData = [];
            for (let key in json) {
                if (key.startsWith("influence")) {
                    influenceData.push({ key: key, value: json[key] });
                }
            }

            // 获取每月费用数据
            const monthlyPrice = json["monthly price"];
            if (monthlyPrice != null) {
                if (getValueType(monthlyPrice) == "integer") {
                    // 检查每月费用是否满足影响的数值
                    const maxInfluenceValue = (10 * Math.min(monthlyPrice, 10 ** 6)) / (json.height * json.width);
                    for (let j = 0; j < influenceData.length; j++) {
                        if (influenceData[j].value > maxInfluenceValue) {
                            thisValueResult.push({ "type": "Failure", "message": `影响${influenceData[j].key}数值过大，最大(${maxInfluenceValue})` })
                        } else {
                            thisValueResult.push({ "type": "Pass", "message": `影响${influenceData[j].key}检查通过` })
                        }
                    }
                } else {
                    thisValueResult.push({ "type": "Failure", "message": `发现每月费用(monthly price)的数据类型不正确，得到${getValueType(monthlyPrice)}，应是integer` })
                }
            } else {
                thisValueResult.push({ "type": "Warning", "message": `未发现每月费用(monthly price)而使用影响必须要有每月费用` })
            }
        // 其它键值对
        } else if (target != null) {
            if (getValueType(target) == main[i].type) {
            } else {
                thisValueResult.push({ "type": "Warning", "message": `发现${main[i].key}的数据类型不正确，得到${getValueType(target)}，应是${main[i].type}` })
            }

            if (main[i].restricted === true) {
                switch (main[i].restrict_type) {
                    case "suggestion":
                        let data = main[i].suggestions;
                        for (let j = 0; j < data.length; j++) {
                            switch (data[j].type) {
                                case "type_bool":
                                    if (target == data[j].value) {
                                    } else {
                                        thisValueResult.push({ "type": "Notification", "message": `发现${main[i].key}为${target}，建议是${data[j].value}` })
                                    }
                                    break;
                                default:
                                    break;
                            }
                        }
                        break;
                    case "number":
                        break;
                    default:
                        break;
                }
            }
        }
        else {
            if (main[i].suggested === true) {
                thisValueResult.push({ "type": "Notification", "message": `发现${main[i].key}不存在，建议添加` })
            }
        }
        mainCheckResult[`${main[i].key}`] = thisValueResult;
    }
    result = Object.assign({}, result, mainCheckResult);

    return result;
}