import { Component, Prop, State, Watch, h, Event, EventEmitter, Element } from '@stencil/core';
import FormValidator from '../../services/FormValidator';

export type TType = "number" | "text" | "password" | "email" | "date" | "time" | "tel"

let autoFormGenId = 1;

function generateFormId(type = "input") {
    autoFormGenId += 1;
    return `auto-${type}-${autoFormGenId}`
}

const wordsRegex = /^\w[\w\s,.]*[\w.]$/;
const alphanumericRegex = /^[a-zA-Z0-9]+$/;
const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
const trimRegex = /^[^ ]([\w\W ]*[^ ])?$/;

@Component({
    tag: 'dx-input-field',
    styleUrl: 'input-field.css',
    shadow: false
})



export class InputField {
    formRef: string;
    inputRef: string = generateFormId();
    inputEl: HTMLInputElement;
    formEl: HTMLFormElement;
    @Element() element: HTMLElement;

    @Prop() type: TType = "text";
    @Prop() label: string;
    @Prop({ reflect: true }) value: string = "";
    @Prop() placeholder: string;
    @Prop() min?: number = null;
    @Prop() max?: number = null;
    @Prop() required = false;
    @Prop() disabled = false;
    @Prop() readonly = false;
    @Prop() expected: string = null;
    @Prop() expectedError: string = "El valor no es el esperado";
    @Prop() isWord: boolean = false;
    @Prop() isAlphanumeric: boolean = false;
    @Prop() trim: boolean = false;
    @Prop() regex: string = null;

    @State() currentValue = "";
    @State() error = "";

    @Event({ eventName: 'color-changed' }) valueChange: EventEmitter;

    componentWillLoad() {
        setTimeout(() => {
            this.getFormRef()
            this.update()
        }, 200);
    }

    @Watch("value")
    update() {
        this.currentValue = this.value;
        this.validate()
    }

    getFormRef() {
        this.formEl = this.inputEl.form;
        this.formRef = this.formEl.getAttribute("ref");
        if (!this.formRef) {
            this.formRef = generateFormId("form");
            this.formEl.setAttribute("ref", this.formRef)
        }
        return this.formRef
    }

    validateNumber(): string {
        const v = this.currentValue;
        if (this.disabled == true || this.readonly == true) return null;

        if (v == "") {
            if (this.required) return "El valor es requerido";
            else return null;
        }

        if (isNaN(Number(v))) return "No es un número"
        if (this.min != null && +v < +this.min) return `Mínimo ${this.min}`
        if (this.max != null && +v > +this.max) return `Máximo ${this.max}`
        if (this.expected !== null && +v != +this.expected) return this.expectedError;

        return null
    }

    validateText(): string {
        const v = this.currentValue;
        if (this.disabled == true || this.readonly == true) return null;

        if (v == "") {
            if (this.required) return "El valor es requerido";
            else return null;
        }

        if (this.min != null && v.length < +this.min) return `Mínimo ${this.min}`
        if (this.max != null && v.length > +this.max) return `Máximo ${this.max}`
        if (this.expected !== null && v != this.expected) return this.expectedError;

        if (this.isWord && !wordsRegex.test(v)) return "Words in paragraph required";
        if (this.isAlphanumeric && !alphanumericRegex.test(v)) return "Alphanumeric required";
        if (this.trim && !trimRegex.test(v)) return "End and start without spaces required";
        if (this.type == "email" && !emailRegex.test(v)) return "Email required";
        if (this.regex != null && !(new RegExp(this.regex)).test(v)) return `Regex required ${this.regex}`;

        return null
    }

    validate(): boolean {

        if (this.type == "number") {
            this.error = this.validateNumber()
        }
        if (["text", "password", "email"].indexOf(this.type) >= 0) {
            this.error = this.validateText()
        }

        FormValidator.setForm(this.formRef, this.inputRef, this.error)

        return !this.error;
    }

    inputChanged(ev: any) {
        this.currentValue = ev?.target?.value || "";
        if (!this.validate()) {
            ev.stopImmediatePropagation()
        } else {
            this.valueChange.emit(this.currentValue);
        }
    }

    get inputType() {
        return this.type == "number" ? "text" : this.type;
    }

    get hasError() {
        return this.error && this.error.length ? true : false;
    }

    renderError() {
        return (
            <p key={this.error} class="note error show-on-hover">{this.error}</p>
        )
    }

    render() {
        return (
            <div class="dx-input-field">
                <div class={{ "form-group": true, "errored": this.hasError }} >
                    <input
                        itemRef={this.inputRef}
                        ref={(r) => { this.inputEl = r; }}
                        class="form-control"
                        type={this.inputType}
                        id={`field-${this.label}`}
                        onInput={(e) => this.inputChanged(e)}
                        placeholder={this.placeholder}
                        min={this.min}
                        max={this.max}
                        value={this.currentValue}
                        disabled={this.disabled}
                        readonly={this.readonly}
                    />
                    <label class={{ 'field-label': true, 'on-top': this.currentValue && true }} htmlFor={`field-${this.label}`}>
                        {this.label}
                    </label>

                    {this.hasError && this.renderError()}
                </div>
            </div>
        );
    }
}