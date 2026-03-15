function validateFormData(object) {
    for (let key in object) {
        let value = object[key];
        switch (value) {
            case null:
            case "":
                delete object[key];
                break;
            case "true":
                object[key] = true;
                break;
            case "false":
                object[key] = false;
                break;
            default:
                if (!Number.isNaN(value) && parseInt(value)) {
                    object[key] = parseInt(value);
                }
                break;
        }
    }
    return object;
}

function checkForm(form, callback) {
    let errors = [];
    
    // 获取所有必填字段
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        const value = field.value.trim();
        const fieldName = field.name || field.id || '未知字段';
        
        if (!value) {
            errors.push(`${fieldName}不能为空`);
        }
    });
    
    // 如果有错误，抛出
    if (errors.length > 0) {
        Web.throwError(errors.join('；'));
        callback(false);
    } else {
        callback(true);
    }
}

// 插件清单文件的检查用函数
function checkPluginManifestData(data, callback) {
    let result = true;
    let errors = [];

    if (!data.id || !data.title || !data.version) {
        result = false;
        errors.push("ID或标题或插件版本未填写");
    }
    callback(result, errors);
}