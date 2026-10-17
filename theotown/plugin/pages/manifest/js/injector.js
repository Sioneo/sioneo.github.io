document.getElementById("plugin-injection-button").addEventListener("click", async () => {
    const zipFile = document.getElementById("plugin-input").files[0];
    if (!zipFile) {
        alert("未导入ZIP压缩包");
        return;
    }

    try {
        const json = window.manifest.generate();
        if (json === null) return;

        const zip = await JSZip.loadAsync(zipFile);

        // 检查是否已经存在 plugin.manifest
        if (zip.files["plugin.manifest"]) {
            console.log("[注入] 发现已经存在的清单文件")
            if (!confirm("插件清单文件已经存在于当前压缩包中，覆盖吗？")) {
                console.log("[注入] 用户中断了注入");
                return;
            } else {
                console.log("[注入] 用户继续了覆盖操作")
            }
        }

        zip.file("plugin.manifest", json);

        const outBlob = await zip.generateAsync({
            type: "blob",
            mime: "application/zip",
            compression: "STORE"
        })

        const url = URL.createObjectURL(outBlob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${zipFile.name.replace(/\.zip$/i, "")}_manifest_injected.zip`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000)
    } catch (error) {
        alert(`注入过程中发生错误: ${error}`);
    }
})
