import { Form } from "/web/modules/form.js";

export class Building{
    constructor({
        items = [
            
        ],
        mountpoint,
        formId,
        onSubmit
    } = {}) {
        this.formId = formId ?? `building-form-${crypto.randomUUID()}`;
        this.buildingForm = new Form(items,
            {
                container: mountpoint,
                formId: this.formId,
                omitEmpty: true
            }
        );
        this.onSunmit = onSubmit;
        this.mountpoint = mountpoint;
        this.json = "";
    }

    getForm() {
        return this.buildingForm;
    }

    getJson() {
        return this.json;
    }

    generate() {
        this.json = this.buildingForm.generate();
        return this.json;
    }

    validate() {
        return this.buildingForm.validate();
    }
}