// ============================================
// 工具函数：ArrayBuffer → SHA-256 Hex
// ============================================
async function computeSha256(buffer) {
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// ============================================
// 主函数：extractApk（只输出 SHA-256）
// ============================================
async function extractApk(apkFile) {
    // 读取 APK 文件为 ArrayBuffer
    const arrayBuffer = await apkFile.arrayBuffer();
    
    // 加载为 ZIP
    const zip = await JSZip.loadAsync(arrayBuffer);
    
    // 结果对象
    const result = {
        apk: "",
        androidManifest: "",
        classesDex: {}
    };
    
    // ---------- 1. 计算整体 APK SHA-256 ----------
    result.apk = await computeSha256(arrayBuffer);
    
    // ---------- 2. 提取并计算 AndroidManifest.xml ----------
    const manifestEntry = zip.files['AndroidManifest.xml'];
    if (manifestEntry) {
        const manifestBuffer = await manifestEntry.async('arraybuffer');
        result.androidManifest = await computeSha256(manifestBuffer);
    }
    
    // ---------- 3. 提取并计算所有 classes*.dex ----------
    const dexFiles = Object.keys(zip.files)
        .filter(name => /^classes\d*\.dex$/.test(name))
        .sort();
    
    for (const dexName of dexFiles) {
        const dexBuffer = await zip.files[dexName].async('arraybuffer');
        const dexHash = await computeSha256(dexBuffer);
        result.classesDex[dexName] = dexHash;
    }
    
    return result;
}

// ============================================
// 使用示例
// ============================================
// const result = await extractApk(file);
// console.log(result);
// 
// 输出：
// {
//     apk: "a1b2c3d4e5f6...",
//     androidManifest: "f6e5d4c3b2a1...",
//     classesDex: {
//         "classes.dex": "1a2b3c4d5e6f...",
//         "classes2.dex": "2b3c4d5e6f7a...",
//         "classes3.dex": "3c4d5e6f7a8b..."
//     }
// }
