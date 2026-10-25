import { FORM_BASIC_ITEMS } from "../data/form-items/form-items-building.js";
import { Form } from "/web/modules/form.js";
import { Frame } from "../modules/module-frame.js"

export class Building {
    constructor({
        mountpoint,
        formId,
        onSubmit
    } = {}) {
        this.formId = formId ?? `building-form-${crypto.randomUUID()}`;
        this.buildingForm = new Form(FORM_BASIC_ITEMS,
            {
                container: mountpoint,
                formId: this.formId,
                omitEmpty: true
            }
        );
        this.onSubmit = onSubmit;
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