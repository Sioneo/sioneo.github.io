function showCreatePluginManifestDialog(callback) {
    document.getElementById("plugin-manifest-dialog").showModal();
    if (!generalData.pluginManifestDialog.hasAddedListenerToSubmitButton) {
        document.getElementById("plugin-manifest-submit-button").addEventListener("click", function () {
            let form = new FormData(document.getElementById("plugin-manifest-form"));
            let manifest = {
                id: form.get("id"),
                title: form.get("title"),
                version: form.get("version"),
                text: form.get("text"),
                url: form.get("url"),
                author: form.get("author"),
                "min version": form.get("min version"),
                category: form.has("category"),
                multiplayer: form.has("multiplayer"),
                permanent: form.has("peremanent"),
                platforms: form.getAll("platforms")
            }

            checkPluginManifestData(manifest, function (result, errors) {
                if (result) {
                    callback(manifest);
                } else {
                    Web.throwError(errors[0]);
                }
            })
        })
        generalData.pluginManifestDialog.hasAddedListenerToSubmitButton = true;
    }
}

document.getElementById("new-package-button").addEventListener("click", function () {
    const zipFile = new JSZip();

    showCreatePluginManifestDialog(function (manifest) {
        // 导入动画的图片资源
        let animationImages = imageData.rci.animation;
        for (let animationId in animationImages) {
            let frames = animationImages[animationId].frames;
            for (let frameId in frames) {
                let image = frames[frameId].resource.image;
                zipFile.file(image.name, image);
            }
        }

        // 导入独立帧的图片资源
        let frameImages = imageData.rci.frames;
        for (let frameId in frameImages) {
            let image = frameImages[frameId].resource.image;
            zipFile.file(image.name, image);
        }

        // 导入JSON
        zipFile.file("code.json", JSON.stringify(jsonData.rci.json, null, 2));
        zipFile.file("plugin.manifest", JSON.stringify(manifest, null, 2));

        // 生成zip
        zipFile.generateAsync({
            type: "blob",
            compression: "STORE"  // 明确指定不压缩（默认就是STORE）
        }).then(function (content) {
            // 创建下载链接
            const link = document.createElement('a');
            link.href = URL.createObjectURL(content);
            link.target = "_blank";
            link.download = generalData.projectName? `${generalData.projectName}.zip`: "plugin.zip";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);  // 清理内存
        });
    })
})