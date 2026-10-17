import { Manifest } from "../../../modules/module-manifest.js"

// document.getElementById("manifest-id-random-button").addEventListener("click", () => {
//     document.getElementById("manifest-id-input").value = "$" + crypto.randomUUID();
// }) 

const manifest = new Manifest({
    mountpoint: document.getElementById("form-mountpoint")
});
window.manifest = manifest;
const jsonOutput = document.getElementById("json-output");
document.getElementById("generate-button").addEventListener("click", () => {
    const json = manifest.generate();
    if (json === null) {
        console.log("[JSON生成] 表单校验失败");
        return;
    }
    jsonOutput.textContent = json;
})
