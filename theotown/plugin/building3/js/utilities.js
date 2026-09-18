class Utils {
    static MESSAGE_TYPE_INFO = "Info";
    static MESSAGE_TYPE_WARNING = "Warning";
    static MESSAGE_TYPE_EXCEPTION = "Exception";

    static hint(message, source, type = this.MESSAGE_TYPE_INFO) {
        switch(type) {
            case this.MESSAGE_TYPE_INFO:
                console.log(`[Info] ${source}: ${message}`);
                break;
            case this.MESSAGE_TYPE_WARNING:
                console.warn(`[Warning] ${source}: ${message}`);
                break;
            case this.MESSAGE_TYPE_EXCEPTION:
                console.error(`[Exception] ${source}: ${message}`);
                break;
            default:
                console.log(`[Unknown Type] ${source}: ${message}`);
        }
    };

    static makeReactive(target, onUpdate) {
        return new Proxy(target, {
          set(obj, key, value) {
            const old = obj[key];
            obj[key] = value;
            if (old !== value) {
              console.log(`[Proxy] ${key} 已变化 从 ${old} 到 ${value}`);
              onUpdate();
            }
            return true;
          },

          deleteProperty(obj, key) {
            if (key in obj) {
              delete obj[key];
              console.log(`[Proxy] ${key} 已删除`);
              onUpdate();
            }
            return true;
          }
        });
    }
}
