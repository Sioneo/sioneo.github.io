import { Form } from "../../../web/service/modules/form.js"

// 处理plugin.manifest的类
export class Manifest {
    constructor({
        items = [],
        mountpoint,
        formId,
        onSubmit,
    } = {}) {
        this.manifestForm = new Form(items,
            {
                container: mountpoint,
                formId: "manifest-form",
                omitEmpty: true
            }
        );
        this.formId = formId ?? "form-" + Math.random().toString(36).slice(2, 8);
        this.onSubmit = onSubmit;
        this.mountpoint = mountpoint;
        this.json = "";

        // 为 ID 行加入随机ID按钮
        const randomIdButton = document.createElement("button");
        randomIdButton.className = "button-small";
        randomIdButton.type = "button";
        randomIdButton.textContent = "随机ID";
        randomIdButton.addEventListener("click", () => {
            const input = this.manifestForm.getLine("id").querySelector("#manifest-id-input");
            input.value = "$" + crypto.randomUUID();
        })
        this.manifestForm.getLine("id").appendChild(randomIdButton);
    }

    getForm() {
        return this.manifestForm;
    }

    getJson() {
        return this.json;
    }

    generate() {
        const idInput = this.manifestForm.render().elements.namedItem("id");
        // 空 ID 留给 required 校验，避免补成 "$" 后意外通过校验。
        if (idInput.value && !idInput.value.startsWith("$")) {
            idInput.value = "$" + idInput.value;
        }
        this.json = this.manifestForm.generate();
        return this.json;
    }

    validate() {
        return this.manifestForm.validate();
    }
}
