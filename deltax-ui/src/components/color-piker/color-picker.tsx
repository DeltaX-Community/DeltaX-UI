import { Component, Prop, State, h, Event, EventEmitter } from '@stencil/core';

@Component({
    tag: 'color-picker',
    styleUrl: 'color-picker.css'
})
export class ColorPicker {

    @Prop() defaultValue: string = "#ff0000";
    @Prop() resettable: boolean = false;

    @State() value: string;

    @Event({ eventName: 'color-changed' }) colorChanged: EventEmitter;

    componentWillLoad() {
        this.setValue(this.defaultValue);
    }

    handleChange(event) {
        document.dispatchEvent(new CustomEvent("click", { "detail": "true" }));
        event.preventDefault()
        this.setValue(event.target.value);
    }

    setValue(value: string) {
        this.value = value;
        this.colorChanged.emit(value);
    }

    reset() {
        this.setValue(this.defaultValue);
    }

    renderResetButton() {
        if (this.resettable) {
            return <button onClick={() => this.reset()}>X</button>;
        }
    }

    render() {
        return (
            <div class="color-picker">
                <input type="color" value={this.value} onChange={(ev) => this.handleChange(ev)} />
                <span>{this.value}</span>
                {this.renderResetButton()}
            </div>
        );
    }
}