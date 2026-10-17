export class FileManager {
    constructor(options = {}) {
        this.createBlobUrl = options.createBlobUrl ?? false;
        this.onChange = options.onChange;
    }

    #fileList = [];
    #fileIndex = new Map();
    #fileUrls = new Map();

    addFile(file, id = crypto.randomUUID()) {
        if (!file) throw new TypeError('[FileManager] file is required');
        if (this.#fileIndex.has(id)) throw new Error(`[FileManager] id ${id} already exists`);
        
        this.#fileList.push(id);
        this.#fileIndex.set(id, file);
        let url;
        if (this.createBlobUrl) {
            url = URL.createObjectURL(file);
            this.#fileUrls.set(id, url);
        }
        this.onChange({ type: "add", id: id, file: file, url: url });
        return id;
    }

    getFileList() { return [...this.#fileList] }

    getFileById(id) {
        if (!this.#fileIndex.has(id)) {
            console.warn(`[FileManager] File ${id} does not exist!`);
        }
        return this.#fileIndex.get(id) ?? null;
    }

    getFileUrlById(id) {
        if (!this.#fileUrls.has(id)) {
            console.log(`[FileManager] File URL ${id} does not exist!`);
        }
        return this.#fileUrls.get(id) ?? null;
    }

    deleteFileById(id) {
        if (!this.#fileIndex.has(id)) {
            console.warn(`[FileManager] Trying to delete file ${id} which does not exist, ignored action.`);
            return;
        }
        this.#fileIndex.delete(id);
        // Revoke 先前创建的 URL (如果有的话)
        if (this.#fileUrls.get(id)) {
            URL.revokeObjectURL(this.#fileUrls.get(id));
            this.#fileUrls.delete(id);
        }
        this.#fileList.splice(this.#fileList.indexOf(id), 1);
        this.onChange({ type: "delete", id: id });
    }
}