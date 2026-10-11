import { Manifest } from "../modules/module-manifest.js"

// document.getElementById("manifest-id-random-button").addEventListener("click", () => {
//     document.getElementById("manifest-id-input").value = "$" + crypto.randomUUID();
// })
const manifestItems =
    [
        {
            id: "manifest-id-input",
            name: "id",
            type: "string",
            label: "ID",
            required: true,
            placeholder: "插件清单的id",
        },
        {
            id: "manifest-title-input",
            name: "title",
            type: "string",
            label: "标题",
            required: true,
            placeholder: "插件的标题",
        },
        {
            id: "manifest-text-input",
            name: "text",
            type: "string",
            label: "描述",
            placeholder: "插件的描述",
        },
        {
            id: "manifest-version-input",
            name: "version",
            type: "number",
            label: "插件版本",
            placeholder: "插件的版本，如：1, 2, 123",
            attrs: { min: 0, step: 1 },
        },
        {
            id: "manifest-author-input",
            name: "author",
            type: "string",
            label: "作者",
            placeholder: "插件的作者",
        },
        {
            id: "manifest-url-input",
            name: "url",
            type: "url",
            label: "URL",
            placeholder: "插件下载链接，必须带 https://",
        },
        {
            id: "manifest-thumbnail-input",
            name: "thumbnail",
            type: "string",
            label: "封面",
            placeholder: "如 image.png",
        },
        {
            id: "manifest-min-version-input",
            name: "min_version",
            keyName: "min version",   // 输出 JSON 时用带空格的 key
            type: "number",
            label: "最低游戏版本",
            placeholder: "如 11289 代表 1.12.89",
        },
        {
            id: "manifest-category-input",
            name: "category",
            type: "boolean",
            label: "category",
            value: true,
        },
        {
            id: "manifest-multiplayer-input",
            name: "multiplayer",
            type: "boolean",
            label: "multiplayer",
            value: true,
        },
        {
            id: "manifest-once-input",
            name: "once",
            type: "boolean",
            label: "once",
            value: true,
        },
        {
            id: "manifest-permanent-input",
            name: "permanent",
            type: "boolean",
            label: "permanent",
            value: true,
        },
    ]

const manifest = new Manifest({
    items: manifestItems,
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
