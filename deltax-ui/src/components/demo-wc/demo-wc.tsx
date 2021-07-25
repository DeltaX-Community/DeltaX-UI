import { Component, Prop, State, Host, h, Event, EventEmitter } from '@stencil/core';
import RtTimer from '../../services/RtTimer';

@Component({
  tag: 'demo-wc',
  styleUrl: 'demo-wc.scss',
  shadow: true,
})
export class DemoWc {
  /**
   * The name
   */
  @Prop() name: string;
  @Prop() timeout: number = 2000;

  @State() value: Date;

  @Event({ eventName: 'input-change' }) inputChange: EventEmitter;

  componentWillLoad() {
    this.loadTimer();
  }

  loadTimer() {
    let timer = RtTimer.get(this.timeout);
    timer.subscribe((d) => {
      this.value = d
      this.inputChange.emit(this.value.toISOString())
    })
    this.value = timer.state.date
  }

  render() {
    return (
      <Host>
        <div class="pepe">RtTimer Date: {this.value.toISOString()} name: {this.name}</div>
        <button class="button is-primary">example button </button>
      </Host>
    );
  }

}
