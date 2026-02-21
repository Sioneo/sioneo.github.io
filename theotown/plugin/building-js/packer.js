function showCreatePluginManifestDialog(callback) {
    let manifest = {};

    document.getElementById("plugin-manifest-dialog").showModal();
    if (!generalData.pluginManifestDialog.hasAddedListenerToSubmitButton) {
        document.getElementById("plugin-manifest-submit-button").addEventListener("click", function() {
            let form = new FormData(document.getElementById("plugin-manifest-form"));
        })
        generalData.pluginManifestDialog.hasAddedListenerToSubmitButton = true;
    }
    callback(manifest);
}

document.getElementById("new-package-button").addEventListener("click", function() {
    const zipFile = new JSZip();

    showCreatePluginManifestDialog(function(){

    })
})