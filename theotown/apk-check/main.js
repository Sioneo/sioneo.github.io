const elementIdData = {
    "apk": {callout: "apk-result-callout", label: "apk-result-label"},
    "androidManifest": {callout: "android-manifest-result-callout", label: "android-manifest-result-label"},
    "classes.dex": {callout: "classes-dex-result-callout", label: "classes-dex-result-label"}
}

// 用于输出结果的辅助函数
function print(text = "Unknown message", type = "normal") {
    let color = "black";
    if (type == "pass") color = "green";
    if (type == "warning") color = "red";

    document.getElementById("check-log").insertAdjacentHTML("beforeend", `<br><span style="color: ${color}; font-family: monospace">${text}</span>`);
}

// 展现检查结果的函数
function showResult(result, target) {
    if (result) {
        document.getElementById(elementIdData[target].callout).className = "callout background pass flex";
        document.getElementById(elementIdData[target].label).textContent = "一致";
        print(`${target} ... PASS`, "pass");
    } else {
        document.getElementById(elementIdData[target].callout).className = "callout background warning flex";
        document.getElementById(elementIdData[target].label).textContent = "不一致";
        print(`${target} ... FAIL`, "warning");
    }
}

document.getElementById("check-button").addEventListener("click", async function() {
    const apk = document.getElementById("apk-input").files[0];
    const version = document.getElementById("version-input").value;

    if (!Object.keys(hashData).includes(version)) {
        alert("没有对应的版本");
        console.log("没有对应的版本");
        return;
    }

    if (!apk) {
        alert("未导入文件!");
        console.log("未导入文件!");
        return;
    }

    try {
        console.log("正在处理...");
        const result = await extractApk(apk);
        console.log("Result: ",  result);

        // 开始对比并实时输出结果
        // APK file
        print(`上传APK的SHA-256值: ${result.apk}`);
        print(`参考APK的SHA-256值: ${hashData[version].apk}`);
        if (result.apk == hashData[version].apk) {
            showResult(true, "apk");
        } else {
            showResult(false, "apk");
        }

        // AndroidManifest
        print(`上传AndroidManifest.xml的SHA-256值: ${result.androidManifest}`);
        print(`参考AndroidManifest.xml的SHA-256值: ${hashData[version].androidManifest}`);
        if (result.androidManifest == hashData[version].androidManifest) {
            showResult(true, "androidManifest");
        } else {
            showResult(false, "androidManifest");
        }

        // classes.dex
        const classesDexEntries = Object.entries(hashData[version]["classes.dex"]);
        console.log("classes.dex entries:", classesDexEntries);
        let classesDexPass = true;
        classesDexEntries.forEach(([key, value]) => {
            const extractedHash = result["classesDex"][key];
            print(`上传${key}的SHA-256值: ${extractedHash}`);
            print(`参考${key}的SHA-256值: ${value}`);
            if (extractedHash == value) {
                print(`${key} ... PASS`, "pass");
            } else {
                print(`${key} ... FAIL`, "warning");
                classesDexPass = false;
            }
        })
        if (classesDexPass) {
            showResult(true, "classes.dex");
        } else {
            showResult(false, "classes.dex");
        }


    } catch (error) {
        console.error(error);
        alert(`发生错误：${error}`);
    }
})
