// 页面上出现的动态文案（由 javascript/pixel.js 使用）
// 用法与动画开发工具一致：页面先引入本文件，再用 <script>var Strings = Translations.ZH;</script> 选择语言
var Translations = {
    ZH: {
        ERROR_INPUT_NOT_FILE: "第一个参数必须是 <input type=\"file\"> 的 DOM",
        ERROR_CANVAS_NOT_CANVAS: "第三个参数必须是 <canvas> 的 DOM",
        ERROR_BAD_SCALE: "缩放比例必须是大于 0 的有限数字",
        ERROR_NO_FILE: "没有选择文件",
        ERROR_NOT_IMAGE: "选择的文件不是图片",
        ERROR_IMAGE_LOAD_FAILED: "图片加载失败",

        EXPORT_FETCHING: "正在抓取需要的文件...",
        EXPORT_PROCESSING: "抓取完成, 正在处理...",
        EXPORT_DONE: "打包完成: ",
        EXPORT_FAILED: "导出失败: ",

        ERROR_BASE_CODE_FETCH: "PPG_base/code.json 抓取失败: ",
        ERROR_GENERATOR_CODE_FETCH: "generator/code.json 抓取失败: ",
        ERROR_GENERATOR_MANIFEST_FETCH: "generator/plugin.manifest 抓取失败: ",
        ERROR_GENERATOR_LUA_FETCH: "generator/script.lua 抓取失败: ",
        ERROR_CODE_PARSE: "code.json 解析失败: ",
        ERROR_CODE_NOT_ARRAY: "generator/code.json 顶层不是数组",
        ERROR_BASE_CODE_PARSE: "PPG_base/code.json 解析失败: ",
        ERROR_BASE_CODE_NOT_ARRAY: "PPG_base/code.json 顶层不是数组",
        ERROR_BASE_DRAFT_MISSING: "PPG_base/code.json 中未找到共享 baseDraft id: ",
        ERROR_MANIFEST_PARSE: "plugin.manifest 解析失败: ",
        ERROR_MANIFEST_NO_ID: "plugin.manifest 缺少 id 字段",
        ERROR_NO_PIXEL_DATA: "pixelData 为空，拒绝导出"
    },
    EN: {
        ERROR_INPUT_NOT_FILE: "The first argument must be an <input type=\"file\"> element",
        ERROR_CANVAS_NOT_CANVAS: "The third argument must be a <canvas> element",
        ERROR_BAD_SCALE: "The scale must be a finite number greater than 0",
        ERROR_NO_FILE: "No file selected",
        ERROR_NOT_IMAGE: "The selected file is not an image",
        ERROR_IMAGE_LOAD_FAILED: "Failed to load the image",

        EXPORT_FETCHING: "Fetching the required files...",
        EXPORT_PROCESSING: "Fetch complete, processing...",
        EXPORT_DONE: "Packaged: ",
        EXPORT_FAILED: "Export failed: ",

        ERROR_BASE_CODE_FETCH: "Failed to fetch PPG_base/code.json: ",
        ERROR_GENERATOR_CODE_FETCH: "Failed to fetch generator/code.json: ",
        ERROR_GENERATOR_MANIFEST_FETCH: "Failed to fetch generator/plugin.manifest: ",
        ERROR_GENERATOR_LUA_FETCH: "Failed to fetch generator/script.lua: ",
        ERROR_CODE_PARSE: "Failed to parse code.json: ",
        ERROR_CODE_NOT_ARRAY: "generator/code.json is not an array",
        ERROR_BASE_CODE_PARSE: "Failed to parse PPG_base/code.json: ",
        ERROR_BASE_CODE_NOT_ARRAY: "PPG_base/code.json is not an array",
        ERROR_BASE_DRAFT_MISSING: "The shared baseDraft id was not found in PPG_base/code.json: ",
        ERROR_MANIFEST_PARSE: "Failed to parse plugin.manifest: ",
        ERROR_MANIFEST_NO_ID: "plugin.manifest is missing the id field",
        ERROR_NO_PIXEL_DATA: "No pixel data to export"
    }
}
