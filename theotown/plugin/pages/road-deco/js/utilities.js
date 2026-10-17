/**
 * 加载并返回一个 Image 对象（通过回调）
 * @param {string|File} src - 图片地址（URL字符串）或 File 对象（来自 input.files[0]）
 * @param {function(HTMLImageElement)} callback - 加载完成后的回调函数
 */
function loadImage(src, callback) {
    const img = new Image();
    
    img.onload = () => {
        console.log("加载图片", src);
        callback(img);
    };
    img.onerror = () => callback(null);
    
    // 判断是不是 File 对象（来自 input.files[0]）
    if (src instanceof File) {
        // 是文件，用 URL.createObjectURL
        img.src = URL.createObjectURL(src);
    } else {
        // 是字符串（URL 或路径），直接使用
        img.src = src;
    }
}