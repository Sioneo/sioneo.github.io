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
    throw new Error('第一个参数必须是 <input type="file"> 的 DOM');
  }
  if (!canvasDom || canvasDom.tagName !== 'CANVAS') {
    throw new Error('第三个参数必须是 <canvas> 的 DOM');
  }
  if (typeof scale !== 'number' || scale <= 0 || !isFinite(scale)) {
    throw new Error('缩放比例必须是大于 0 的有限数字');
  }

  const file = inputDom.files && inputDom.files[0];
  if (!file) {
    throw new Error('没有选择文件');
  }
  if (!file.type.startsWith('image/')) {
    throw new Error('选择的文件不是图片');
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
      reject(new Error('图片加载失败'));
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

const infoParagraph = document.getElementById("export-info");
function print(msg = "Unknown Message") { infoParagraph.innerHTML = msg; }

function toLuaTable(value, indent = 0, compact = true) {
    const pad = "    ".repeat(indent);
    const padInner = "    ".repeat(indent + 1);
    const nl = compact ? "" : "\n";
    const sp = compact ? " " : "";

    if (value === null || value === undefined) return "nil";
    if (typeof value === "number") return isFinite(value) ? String(value) : "nil";
    if (typeof value === "boolean") return value ? "true" : "false";
    if (typeof value === "string") {
        const escaped = value
            .replace(/\\/g, "\\\\")
            .replace(/"/g, '\\"')
            .replace(/\n/g, "\\n")
            .replace(/\r/g, "\\r")
            .replace(/\t/g, "\\t");
        return `"${escaped}"`;
    }
    if (Array.isArray(value)) {
        if (value.length === 0) return "{}";
        // 如果全是数字且长度较短，压成一行
        const allNumbers = value.every(v => typeof v === "number");
        if (allNumbers && value.length <= 8) {
            return "{" + value.join(", ") + "}";
        }
        const items = value.map(v => padInner + toLuaTable(v, indent + 1, compact));
        return "{" + nl + items.join("," + nl) + nl + pad + "}";
    }
    if (typeof value === "object") {
        const keys = Object.keys(value);
        if (keys.length === 0) return "{}";
        const items = keys.map(k => {
            const luaKey = /^[A-Za-z_][A-Za-z0-9_]*$/.test(k) ? k : `["${k}"]`;
            return `${padInner}${luaKey} = ${toLuaTable(value[k], indent + 1, compact)}`;
        });
        return "{" + nl + items.join("," + nl) + nl + pad + "}";
    }
    return "nil";
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
        print("正在抓取需要的文件...");

        const [baseRes, coverRes, jsonRes, manifestRes, luaRes] = await Promise.all([
            fetch("/theotown/pixel-picture-plugin/resource/base.png"),
            fetch("/theotown/pixel-picture-plugin/resource/cover.png"),
            fetch("/theotown/pixel-picture-plugin/resource/code.json"),
            fetch("/theotown/pixel-picture-plugin/resource/plugin.manifest"),
            fetch("/theotown/pixel-picture-plugin/resource/script.lua")
        ]);

        if (!baseRes.ok)     throw new Error("base.png 抓取失败: " + baseRes.status);
        if (!coverRes.ok)    throw new Error("cover.png 抓取失败: " + coverRes.status);
        if (!jsonRes.ok)     throw new Error("code.json 抓取失败: " + jsonRes.status);
        if (!manifestRes.ok) throw new Error("plugin.manifest 抓取失败: " + manifestRes.status);
        if (!luaRes.ok)      throw new Error("script.lua 抓取失败: " + luaRes.status);

        const baseBlob     = await baseRes.blob();
        const coverBlob    = await coverRes.blob();
        const codeJsonText = await jsonRes.text();
        const manifestText = await manifestRes.text();
        const luaText      = await luaRes.text();

        print("抓取完成, 正在处理...");

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
            throw new Error("code.json 解析失败: " + e.message);
        }
        if (!Array.isArray(codeJson)) {
            throw new Error("code.json 顶层不是数组");
        }

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
            throw new Error("plugin.manifest 解析失败: " + e.message);
        }
        if (manifest && typeof manifest.id === "string") {
            const oldManifestId = manifest.id;
            manifest.id = makeUniqueId(oldManifestId);
            idMap[oldManifestId] = manifest.id;
            exportReport.ids.manifest = { from: oldManifestId, to: manifest.id };
        } else {
            throw new Error("plugin.manifest 缺少 id 字段");
        }
        manifest.text = appendTag(manifest.text, batchTag);

        // ====== 5. 处理 script.lua ======
        // 5.1 准备新 baseDraft id
        const BASE_DRAFT_ID = "$dnswodn48_PxielPictureSpawner_base00";
        const newBaseDraftId = idMap[BASE_DRAFT_ID] || null;
        if (!newBaseDraftId) {
            throw new Error("code.json 中未找到 baseDraft id: " + BASE_DRAFT_ID);
        }

        // 5.2 校验源 Lua 里没有残留 init，防止重复定义
        //     如果还有，给出警告但不中断（后面追加的会覆盖前者，但会互相干扰）
        let luaHasOldInit = false;
        if (/function\s+script:init\s*\(/.test(luaText)) {
            luaHasOldInit = true;
            console.warn("[导出警告] 源 script.lua 里仍存在 script:init，JS 追加的 init 会覆盖它");
        }

        // 5.3 构造 JS 追加的 init 代码
        const initBlock = [
            "",
            "",
            "-- 以下 init 由导出工具动态生成",
            "function script:init()",
            `    baseDraft = Draft.getDraft("${newBaseDraftId}")`,
            "end",
            ""
        ].join("\n");

        // 5.4 把 pixelData 作为 Lua table 注入到第一行
        if (!Array.isArray(pixelData) || pixelData.length === 0) {
            throw new Error("pixelData 为空，拒绝导出");
        }
        const luaDataLiteral = toLuaTable(pixelData, 0, false);

        // 5.5 拼接：local data = ... + 源 Lua + 追加的 init
        const luaWithData =
            `local data = ${luaDataLiteral}\n\n` +
            luaText +
            initBlock;

        exportReport.luaInit = {
            baseDraftId: newBaseDraftId,
            oldInitPresent: luaHasOldInit,
            initCode: initBlock.trim()
        };

        // ====== 6. 组装文件并计算大小 ======
        const files = {
            "base.png":        baseBlob,
            "cover.png":       coverBlob,
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
        const zipName = `ppg_${exportReport.timestamp}.zip`;
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

        print("打包完成: " + zipName + " (" + exportReport.zipSizeText + ")");
        console.log("exportReport =", exportReport);

    } catch (err) {
        exportReport.success = false;
        exportReport.error = err && err.message ? err.message : String(err);
        exportReport.durationMs = Math.round(performance.now() - startTime);
        console.error("导出失败:", err);
        print("导出失败: " + exportReport.error);
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


