// ====== 页面文案 ======
// 文案由页面的 javascript/translation.js 提供（页面里用 var Strings = Translations.ZH / .EN 选择语言），
// 这样中英文页面可以共用这一份脚本；万一页面没引入 translation.js 也不会直接报错。
var PAGE_TEXT = (typeof Strings !== "undefined" && Strings) ? Strings : {};
function t(key) {
    return Object.prototype.hasOwnProperty.call(PAGE_TEXT, key) ? PAGE_TEXT[key] : key;
}
if (PAGE_TEXT.EXPORT_FETCHING === undefined) {
    console.warn("[pixel.js] 未找到 Strings，页面文案会显示为 key，请确认页面引入了 translation.js");
}

/**
 * 读取图片，按比例缩放绘制到 canvas，并输出逐像素 RGB 信息
 *
 * @param {HTMLInputElement} inputDom  - 图片 file input 的 DOM
 * @param {number}           scale     - 缩放比例，如 0.5 表示缩小一半，2 表示放大两倍
 * @param {HTMLCanvasElement} canvasDom - 用于绘制结果的 canvas DOM
 * @param {Object}           [options] - 可选配置
 * @param {boolean}          [options.logPixels=true]   - 是否在控制台输出逐像素 RGB
 * @param {boolean}          [options.logToDom=true]    - 是否把摘要输出到页面（需存在 #log 元素）
 * @param {number}           [options.maxLogPixels=50]  - 最多在控制台打印多少个像素，避免刷屏
 * @param {boolean}          [options.withAlpha=false]  - 像素数组是否包含 alpha，默认 [r,g,b]
 * @returns {Promise<{width:number,height:number,pixels:Uint8ClampedArray,imageData:ImageData,matrix:number[][][]}>}
 */
async function addressImage(inputDom, scale, canvasDom, options = {}) {
  const {
    logPixels = true,
    logToDom = true,
    maxLogPixels = 50,
    withAlpha = false,
  } = options;

  // ---------- 1. 参数校验 ----------
  if (!inputDom || inputDom.tagName !== 'INPUT' || inputDom.type !== 'file') {
    throw new Error(t("ERROR_INPUT_NOT_FILE"));
  }
  if (!canvasDom || canvasDom.tagName !== 'CANVAS') {
    throw new Error(t("ERROR_CANVAS_NOT_CANVAS"));
  }
  if (typeof scale !== 'number' || scale <= 0 || !isFinite(scale)) {
    throw new Error(t("ERROR_BAD_SCALE"));
  }

  const file = inputDom.files && inputDom.files[0];
  if (!file) {
    throw new Error(t("ERROR_NO_FILE"));
  }
  if (!file.type.startsWith('image/')) {
    throw new Error(t("ERROR_NOT_IMAGE"));
  }

  // ---------- 2. 读取图片 ----------
  const img = await new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error(t("ERROR_IMAGE_LOAD_FAILED")));
    };
    image.src = url;
  });

  // ---------- 3. 计算缩放后的尺寸 ----------
  const targetWidth  = Math.max(1, Math.round(img.naturalWidth  * scale));
  const targetHeight = Math.max(1, Math.round(img.naturalHeight * scale));

  // ---------- 4. 设置 canvas 并绘制 ----------
  const ctx = canvasDom.getContext('2d', { willReadFrequently: true });
  canvasDom.width  = targetWidth;
  canvasDom.height = targetHeight;
  ctx.clearRect(0, 0, targetWidth, targetHeight);
  ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

  // ---------- 5. 获取像素数据 ----------
  const imageData = ctx.getImageData(0, 0, targetWidth, targetHeight);
  const pixels = imageData.data; // 一维 RGBA Uint8ClampedArray

  // ---------- 6. 转成三层数组：[行][列][r,g,b(,a)] ----------
  const matrix = [];
  for (let y = 0; y < targetHeight; y++) {
    const row = [];
    for (let x = 0; x < targetWidth; x++) {
      const offset = (y * targetWidth + x) * 4;
      const px = [
        pixels[offset],     // r
        pixels[offset + 1], // g
        pixels[offset + 2], // b
      ];
      if (withAlpha) {
        px.push(pixels[offset + 3]); // a
      }
      row.push(px);
    }
    matrix.push(row);
  }

  // ---------- 7. 输出 RGB 信息 ----------
  if (logPixels) {
    const total = targetWidth * targetHeight;
    const count = Math.min(maxLogPixels, total);
    console.group(`逐像素 RGB（共 ${total} 个像素，显示前 ${count} 个）`);
    for (let i = 0; i < count; i++) {
      const x = i % targetWidth;
      const y = Math.floor(i / targetWidth);
      const px = matrix[y][x];
      console.log(`(${x}, ${y}) → rgb(${px[0]}, ${px[1]}, ${px[2]})` +
        (withAlpha ? `  alpha=${px[3]}` : ''));
    }
    console.groupEnd();
  }

  if (logToDom) {
    const logDom = document.getElementById('log');
    if (logDom) {
      const total = targetWidth * targetHeight;
      logDom.textContent =
        `图片尺寸：${img.naturalWidth} × ${img.naturalHeight}\n` +
        `缩放比例：${scale}\n` +
        `绘制尺寸：${targetWidth} × ${targetHeight}\n` +
        `总像素数：${total}\n` +
        `像素数据长度：${pixels.length}（RGBA，每像素 4 字节）\n` +
        `matrix 结构：matrix[y][x] = [r, g, b${withAlpha ? ', a' : ''}]\n` +
        `前 ${Math.min(maxLogPixels, total)} 个像素的 RGB 已输出到控制台。`;
    }
  }

  // ---------- 8. 返回结果 ----------
  return {
    width: targetWidth,
    height: targetHeight,
    matrix, // 三层数组：[行][列][r,g,b(,a)]
  };
}

var pixelData = [];
const imageSizeDisplay = document.getElementById("image-size-display");
document.getElementById("preview-image-button").addEventListener("click", async () => {
    try {
        const image = await addressImage(
            document.getElementById("image-input"),
            parseFloat(document.getElementById("scale-input").value),
            document.getElementById("preview-canvas")
        )
        pixelData = image.matrix; // 暂存数据
        imageSizeDisplay.innerHTML = `${image.width} × ${image.height}`;
    } catch (error) {
        alert(error);
        return;
    }
})

// ====== 资源路径：基座插件(PPG_base) 与 生成器(generator) 分离 ======
// 基座插件是所有像素画生成器共用的部分（隐藏的彩色格子、封面动画、分类），用户只需安装一次；
// 生成器插件只包含与具体像素画有关的内容（工具项、数据、脚本），并引用基座插件里固定的 id。
const RES_ROOT = "/theotown/pixel-picture-plugin/resource";
const PPG_BASE_DIR = RES_ROOT + "/PPG_base";
const GENERATOR_DIR = RES_ROOT + "/generator";

// 基座插件对外共享的固定 id：不随导出随机化，所有生成器插件共用同一份基座
const BASE_DRAFT_ID = "$jiuru36_PixelPictureGenerator_base00";

const infoParagraph = document.getElementById("export-info");
function print(msg = "Unknown Message") {
    if (infoParagraph) infoParagraph.innerHTML = msg;
}

// ====== 图片数据压缩 ======
// 旧的写法是把每个像素写成 {r, g, b} 表，比如 {255, 0, 0}，一个像素要十几个字符；
// 现在改成把整幅图按 r,g,b 字节流做 base64，一个像素固定 4 个字符，体积约为原来的 1/3。
const BASE64_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
const LUA_BASE64_CHARS_PER_LINE = 120;

// matrix[y][x] = [r, g, b] -> base64 字符串
// 每像素 3 字节，3 字节正好编码成 4 个 base64 字符，所以永远不需要补 '='
function pixelsToBase64(matrix) {
    const bytes = [];
    for (const row of matrix) {
        for (const px of row) bytes.push(px[0], px[1], px[2]);
    }

    let out = "";
    for (let i = 0; i + 2 < bytes.length; i += 3) {
        const n = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];
        out += BASE64_CHARS[(n >> 18) & 63]
             + BASE64_CHARS[(n >> 12) & 63]
             + BASE64_CHARS[(n >> 6) & 63]
             + BASE64_CHARS[n & 63];
    }
    return out;
}

// 生成注入到 script.lua 开头的代码：图片数据 + 解码函数 + 与原来结构一致的 data
function toLuaImageHeader(matrix) {
    const height = matrix.length;
    const width = height > 0 ? matrix[0].length : 0;
    const base64 = pixelsToBase64(matrix);

    const chunks = [];
    for (let i = 0; i < base64.length; i += LUA_BASE64_CHARS_PER_LINE) {
        chunks.push(base64.slice(i, i + LUA_BASE64_CHARS_PER_LINE));
    }

    // base64 里不会出现 ] 和换行以外的字符，且解码时会跳过所有非字母表字符，
    // 所以直接用 Lua 长字符串放数据，不需要任何转义
    const lines = [
        "-- ====== 以下图片数据由导出工具动态生成（base64 压缩） ======",
        `local imageWidth, imageHeight = ${width}, ${height}`,
        "local imageData = [[",
        ...chunks,
        "]]",
        "",
        "-- 把 base64 数据还原成像素表：data[y][x] = {r, g, b}",
        "local function decodeImage(b64, width, height)",
        `    local alphabet = "${BASE64_CHARS}"`,
        "    local value = {}",
        "    for i = 1, #alphabet do",
        "        value[alphabet:sub(i, i)] = i - 1",
        "    end",
        "",
        "    local bytes = {}",
        "    local count, acc = 0, 0",
        "    for i = 1, #b64 do",
        "        local v = value[b64:sub(i, i)]",
        "        if v ~= nil then",
        "            acc = acc * 64 + v",
        "            count = count + 1",
        "            if count == 4 then",
        "                bytes[#bytes + 1] = string.char(math.floor(acc / 65536) % 256, math.floor(acc / 256) % 256, acc % 256)",
        "                count, acc = 0, 0",
        "            end",
        "        end",
        "    end",
        "    local raw = table.concat(bytes)",
        "",
        "    local decoded = {}",
        "    local index = 1",
        "    for y = 1, height do",
        "        local row = {}",
        "        for x = 1, width do",
        "            row[x] = {string.byte(raw, index, index + 2)}",
        "            index = index + 3",
        "        end",
        "        decoded[y] = row",
        "    end",
        "    return decoded",
        "end",
        "",
        "local data = decodeImage(imageData, imageWidth, imageHeight)"
    ];

    return {
        width: width,
        height: height,
        base64Length: base64.length,
        header: lines.join("\n") + "\n\n"
    };
}

document.getElementById("export-button").addEventListener("click", async () => {
    // ====== 0. 报告对象 ======
    let exportReport = {
        success: false,
        timestamp: Date.now(),
        batchTag: "",
        zipName: "",
        zipSize: 0,
        zipSizeText: "",
        files: {},
        ids: {},
        luaInit: null,        // 记录 JS 追加的 init 信息
        error: null,
        durationMs: 0
    };
    const startTime = performance.now();

    try {
        // ====== 1. 抓取资源 ======
        // 生成器插件不再打包基座内容，只引用基座插件共享的固定 id
        print(t("EXPORT_FETCHING"));

        const [baseJsonRes, jsonRes, manifestRes, luaRes] = await Promise.all([
            fetch(PPG_BASE_DIR + "/code.json"),     // 用于校验基座确实提供了共享 id
            fetch(GENERATOR_DIR + "/code.json"),
            fetch(GENERATOR_DIR + "/plugin.manifest"),
            fetch(GENERATOR_DIR + "/script.lua")
        ]);

        if (!baseJsonRes.ok) throw new Error(t("ERROR_BASE_CODE_FETCH") + baseJsonRes.status);
        if (!jsonRes.ok)     throw new Error(t("ERROR_GENERATOR_CODE_FETCH") + jsonRes.status);
        if (!manifestRes.ok) throw new Error(t("ERROR_GENERATOR_MANIFEST_FETCH") + manifestRes.status);
        if (!luaRes.ok)      throw new Error(t("ERROR_GENERATOR_LUA_FETCH") + luaRes.status);

        const baseJsonText = await baseJsonRes.text();
        const codeJsonText = await jsonRes.text();
        const manifestText = await manifestRes.text();
        const luaText      = await luaRes.text();

        print(t("EXPORT_PROCESSING"));

        // ====== 2. 唯一 ID + 批次号 ======
        const tsPart = Date.now().toString(36);
        const randPart = () => Math.random().toString(36).slice(2, 6);

        const now = new Date();
        const dateTag = [
            now.getFullYear(),
            String(now.getMonth() + 1).padStart(2, "0"),
            String(now.getDate()).padStart(2, "0"),
            String(now.getHours()).padStart(2, "0"),
            String(now.getMinutes()).padStart(2, "0"),
            String(now.getSeconds()).padStart(2, "0")
        ].join("");
        const batchTag = `${dateTag}-${randPart()}`;
        exportReport.batchTag = batchTag;

        function makeUniqueId(originalId) {
            const safe = String(originalId || "id");
            return `${safe}_${tsPart}_${randPart()}`;
        }

        function appendTag(text, tag) {
            const t = (text === undefined || text === null) ? "" : String(text);
            if (t.includes(`[batch:${tag}]`)) return t;
            return t ? `${t}\n[batch:${tag}]` : `[batch:${tag}]`;
        }

        // ====== 3. 处理 code.json ======
        let codeJson;
        try {
            codeJson = JSON.parse(codeJsonText);
        } catch (e) {
            throw new Error(t("ERROR_CODE_PARSE") + e.message);
        }
        if (!Array.isArray(codeJson)) {
            throw new Error(t("ERROR_CODE_NOT_ARRAY"));
        }

        // 3.0 校验基座插件确实提供了我们要引用的固定 id，防止两边定义漂移
        let baseCodeJson;
        try {
            baseCodeJson = JSON.parse(baseJsonText);
        } catch (e) {
            throw new Error(t("ERROR_BASE_CODE_PARSE") + e.message);
        }
        if (!Array.isArray(baseCodeJson)) {
            throw new Error(t("ERROR_BASE_CODE_NOT_ARRAY"));
        }
        if (!baseCodeJson.some(item => item && item.id === BASE_DRAFT_ID)) {
            throw new Error(t("ERROR_BASE_DRAFT_MISSING") + BASE_DRAFT_ID);
        }
        exportReport.baseDraftId = BASE_DRAFT_ID;

        // 3.1 第一遍：建 旧id -> 新id 映射，改定义 id
        const idMap = {};
        for (const item of codeJson) {
            if (item && typeof item.id === "string") {
                const newId = makeUniqueId(item.id);
                idMap[item.id] = newId;
                item.id = newId;
            }
        }

        // 3.2 第二遍：改 animation[].id 引用，追加 text 批次号
        for (const item of codeJson) {
            if (item && Array.isArray(item.animation)) {
                for (const anim of item.animation) {
                    if (anim && typeof anim.id === "string" && idMap[anim.id]) {
                        anim.id = idMap[anim.id];
                    }
                }
            }
            if (item && typeof item.text === "string") {
                item.text = appendTag(item.text, batchTag);
            }
        }

        exportReport.ids.codeJson = idMap;

        // ====== 4. 处理 plugin.manifest ======
        let manifest;
        try {
            manifest = JSON.parse(manifestText);
        } catch (e) {
            throw new Error(t("ERROR_MANIFEST_PARSE") + e.message);
        }
        if (manifest && typeof manifest.id === "string") {
            const oldManifestId = manifest.id;
            manifest.id = makeUniqueId(oldManifestId);
            idMap[oldManifestId] = manifest.id;
            exportReport.ids.manifest = { from: oldManifestId, to: manifest.id };
        } else {
            throw new Error(t("ERROR_MANIFEST_NO_ID"));
        }
        manifest.text = appendTag(manifest.text, batchTag);

        // ====== 5. 处理 script.lua ======
        // 5.1 baseDraft 直接引用基座插件里固定的共享 id（第 3.0 步已校验其存在），
        //     不再在生成器内部随机化，这样多个生成器插件可以共用同一份基座

        // 5.2 校验源 Lua 里没有残留 init，防止重复定义
        //     如果还有，给出警告但不中断（后面追加的会覆盖前者，但会互相干扰）
        let luaHasOldInit = false;
        if (/function\s+script:init\s*\(/.test(luaText)) {
            luaHasOldInit = true;
            console.warn("[导出警告] 源 script.lua 里仍存在 script:init，JS 追加的 init 会覆盖它");
        }

        // 5.3 构造 JS 追加的 init 代码：从基座插件取共用的 baseDraft
        const initBlock = [
            "",
            "",
            "-- 以下 init 由导出工具动态生成，引用基座插件(PPG_base)里固定的 baseDraft",
            "function script:init()",
            `    baseDraft = Draft.getDraft("${BASE_DRAFT_ID}")`,
            "end",
            ""
        ].join("\n");

        // 5.4 把 pixelData 压缩成 base64 后注入到第一行
        if (!Array.isArray(pixelData) || pixelData.length === 0) {
            throw new Error(t("ERROR_NO_PIXEL_DATA"));
        }
        const imageHeader = toLuaImageHeader(pixelData);

        // 5.5 拼接：图片数据 + 源 Lua + 追加的 init
        const luaWithData =
            imageHeader.header +
            luaText +
            initBlock;

        exportReport.pixelData = {
            format: "base64",
            imageSize: `${imageHeader.width} × ${imageHeader.height}`,
            pixelCount: imageHeader.width * imageHeader.height,
            base64Length: imageHeader.base64Length,
            rawBytes: imageHeader.width * imageHeader.height * 3
        };

        exportReport.luaInit = {
            baseDraftId: BASE_DRAFT_ID,
            basePluginRequired: true,
            oldInitPresent: luaHasOldInit,
            initCode: initBlock.trim()
        };

        // ====== 6. 组装文件并计算大小 ======
        // 生成器插件只包含与这幅像素画有关的内容，基座(PPG_base)由用户自行下载安装，
        // 因此这里不再打包 base.png / cover.png
        const files = {
            "code.json":       new Blob([JSON.stringify(codeJson, null, 2)], { type: "application/json" }),
            "plugin.manifest": new Blob([JSON.stringify(manifest, null, 2)], { type: "application/json" }),
            "script.lua":      new Blob([luaWithData], { type: "text/plain" })
        };

        for (const [name, blob] of Object.entries(files)) {
            exportReport.files[name] = {
                size: blob.size,
                sizeText: formatSize(blob.size)
            };
        }

        // ====== 7. 打包 zip ======
        const zip = new JSZip();
        for (const [name, blob] of Object.entries(files)) {
            zip.file(name, blob);
        }

        const zipBlob = await zip.generateAsync({
            type: "blob",
            compression: "DEFLATE",
            compressionOptions: { level: 6 }
        });

        // ====== 8. 自动下载 ======
        const zipName = `ppg_generator_${exportReport.timestamp}.zip`;
        exportReport.zipName = zipName;
        exportReport.zipSize = zipBlob.size;
        exportReport.zipSizeText = formatSize(zipBlob.size);

        const url = URL.createObjectURL(zipBlob);
        const a = document.createElement("a");
        a.href = url;
        a.download = zipName;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 10_000);

        // ====== 9. 收尾 ======
        exportReport.success = true;
        exportReport.durationMs = Math.round(performance.now() - startTime);

        print(t("EXPORT_DONE") + zipName + " (" + exportReport.zipSizeText + ")");
        console.log("exportReport =", exportReport);

    } catch (err) {
        exportReport.success = false;
        exportReport.error = err && err.message ? err.message : String(err);
        exportReport.durationMs = Math.round(performance.now() - startTime);
        console.error("导出失败:", err);
        print(t("EXPORT_FAILED") + exportReport.error);
    }

    window.exportReport = exportReport;
    return exportReport;
});

// ====== 工具函数 1：字节转可读大小 ======
function formatSize(bytes) {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    return (bytes / 1024 / 1024).toFixed(2) + " MB";
}
