class Hub {
    static #instances = {}; // 存储注册的实例
    // 数据结构: { { instance: Instance, status: {} } }

    // 初始化Hub
    static init() {
        this.#instances = Utils.makeReactive(
            this.#instances, 
            () => {
                this.buildNavBar();
                this.buildDOM();
                Utils.hint(`实例列表已更新`, "Hub.init", Utils.MESSAGE_TYPE_INFO);
            }
        )
    }

    // 获取所有实例
    static getAll() {
        return this.#instances;       
    }

    // 获取实例
    static get(id) {
        if (!this.#instances[id]) {
            Utils.hint(`找不到目标 ${id}`, "Hub.get", Utils.MESSAGE_TYPE_EXCEPTION);
            return null;
        }

        return this.#instances[id];
    }

    // 注册实例
    static #registryCount = 0;
    static register(type) {
        const instanceId = `${type}_${this.#registryCount}`;
        let newInstance;
        switch(type) {
            case "building":
                newInstance = new Building();
                break;
            default:
                Utils.hint("未知的实例类型", "Hub.register", Utils.MESSAGE_TYPE_EXCEPTION);
                return null;
        }

        this.#instances[instanceId] = { instance: newInstance, status: { active: false, protected: false } };
        this.#registryCount++;
        Utils.hint(`创建了实例 ${instanceId}`, "Hub.register");
        return instanceId;
    }

    // 删除实例
    static remove(id) {
        if (!this.#instances[id]) { 
            Utils.hint(`找不到目标 ${id}`, "Hub.remove", Utils.MESSAGE_TYPE_EXCEPTION);
            return false;
        }

        if (this.instances[id].status.protected) {
            Utils.hint(`移除失败, 尝试移除一个受保护实例 ${id}`, "Hub.remove", Utils.MESSAGE_TYPE_WARNING);
            return false;
        }

        delete this.#instances[id];
        Utils.hint(`删除了 ${id}`, "Hub.remove");
        return true;
    }

    // 去激活某一个实例的DOM (隐藏DOM)
    static deactivate(id) {
        if (!this.#instances[id]) {
            Utils.hint(`找不到目标 ${id}`, "Hub.deactivate", Utils.MESSAGE_TYPE_EXCEPTION);
            return false;
        }
        this.#instances[id].status.active = false;
        Utils.hint(`已去激活 ${id}`, "Hub.deactivate");
        return true;
    }

    // 去激活所有实例的DOM (隐藏DOM)
    static deactivateAll() {
        for (const id in this.#instances) {
            this.#instances[id].status.active = false;
        }
        Utils.hint(`已去激活所有实例`, "Hub.deactivateAll");
    }

    // 激活某一个实例的DOM (显示DOM)
    static activate(id) {
        if (!this.#instances[id]) {
            Utils.hint(`找不到目标 ${id}`, "Hub.activate", Utils.MESSAGE_TYPE_EXCEPTION);
            return false;
        }
        this.#instances[id].status.active = true;
        Utils.hint(`已激活 ${id}`, "Hub.activate");
        return true;
    }
    
    // 构建导航栏
    static buildNavBar() {
    
    }

    // 构建页面
    static buildDOM() {
        for (const id in this.#instances) {
            const value = this.#instances[id];
            if ( !value.status.active ) {
                value.instance.hide();
                continue;
            }

            value.instance.display();
            Utils.hint(`已构建DOM, 活跃实例: ${id}`, "Hub.buildDOM", Utils.MESSAGE_TYPE_INFO);
            return;
        }
    }
}

Hub.init();
