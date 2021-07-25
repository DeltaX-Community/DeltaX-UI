import { Component, Element, Event, EventEmitter, Prop, h } from '@stencil/core';


@Component({
  tag: 'input-wrapper',
  // styleUrl: 'input-wrapper.scss'
})
export class FormInputBase {
  @Element() el: HTMLElement;
  @Prop() type: string = 'text';
  @Prop() label: string;
  @Prop({ mutable: true, reflect: true }) value: string;
  @Event() valueChange: EventEmitter;

  inputChanged(ev: any) {
    let val = ev?.target?.value || "";

    if (val.length > 5) {
      this.value = "pepe";
      ev.stopImmediatePropagation()
    } else {
      this.value = val;
    }

    this.valueChange.emit(this.value);
  }

  render() {
    return (
      <div>
        <label>{this.label}:
          <div>
            <input value={this.value} onInput={(e) => this.inputChanged(e)}></input>
          </div>
        </label>
      </div>
    )
  }
}
