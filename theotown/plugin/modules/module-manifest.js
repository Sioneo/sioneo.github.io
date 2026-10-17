import { Form } from "../../../web/modules/form.js"
import { FORM_ITEMS } from "../data/form-items/form-items-manifest.js";

// 处理plugin.manifest的类
export class Manifest {
    constructor({
        mountpoint,
        formId,
        onSubmit,
    } = {}) {
        this.formId = formId ?? `manifest-form-${crypto.randomUUID()}`;
        this.manifestForm = new Form(
            FORM_ITEMS,
            {
                container: mountpoint,
                formId: this.formId,
                omitEmpty: true
            }
        );
        this.onSubmit = onSubmit;
        this.mountpoint = mountpoint;
        this.json = "";

        // 为 ID 行加入随机ID按钮
        const randomIdButton = document.createElement("button");
        randomIdButton.className = "button-small";
        randomIdButton.type = "button";
        randomIdButton.textContent = "随机ID";
        randomIdButton.addEventListener("click", () => {
            const input = this.manifestForm.getLineByName("id").querySelector("#manifest-id-input");
            input.value = "$" + crypto.randomUUID();
        })
        this.manifestForm.getLineByName("id").appendChild(randomIdButton);
    }

    getForm() {
        return this.manifestForm;
    }

    getJson() {
        return this.json;
    }

    generate() {
        this.json = this.manifestForm.generate();
        return this.json;
    }

    validate() {
        return this.manifestForm.validate();
    }
}
