
import { createStore } from "@stencil/store";


class FormValidatorClass {
    private store = createStore({} as {
        [name: string]: {
            valid: boolean;
            errors: {
                [input: string]: string | null
            }
        }
    });

    public getForm(ref: string) {
        return this.store.state[ref];
    }

    public getFormErrors(ref: string) {
        return Object.values(this.store.state[ref].errors);
    }

    public setForm(ref: string, input: string, error?: string) {
        const form = this.store.state[ref] || { errors: {}, valid: false };
        form.errors[input] = error;
        form.valid = Object.values(form.errors).find(err => !!err) == null;
        this.store.set(ref, form);
    }
}

const FormValidator = new FormValidatorClass()
export type IFormValidator = typeof FormValidator
export default FormValidator;

declare global { interface Window { FormValidator: IFormValidator; } }
window.FormValidator = FormValidator
