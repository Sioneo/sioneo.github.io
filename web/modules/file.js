// file.js

/* ============================================================
 * 统一的 FileReader 包装
 * ============================================================ */
function readFile(file, readMethod) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => { resolve(reader.result) };
        reader.onerror = () => { reject(reader.error) };
        reader[readMethod](file);
    })
}

/* ============================================================
 * File 类
 * 全部为静态方法，直接 File.readXxx(file) 使用
 * ============================================================ */
class File {
    /** 读取为文本 */
    static async read(file) {
        return readFile(file, "readAsText");
    }

    /** 读取为 DataURL（图片等二进制资源用） */
    static async readAsDataURL(file) {
        return readFile(file, "readAsDataURL");
    }

    /**
     * 读取并解码为图片
     * @param {File|Blob} file
     * @returns {Promise<{name: string, image: HTMLImageElement, width: number, height: number}>}
     */
    static async readImage(file) {
        const dataURL = await File.readAsDataURL(file);
        const image = await new Promise((resolve, reject) => {
            const element = new Image();
            element.onload = () => { resolve(element) };
            element.onerror = () => { reject(new Error(`图片解码失败: ${file.name}`)) };
            element.src = dataURL;
        });
        return {
            name: file.name,
            image,
            width: image.naturalWidth,
            height: image.naturalHeight
        };
    }
}

export default File;
