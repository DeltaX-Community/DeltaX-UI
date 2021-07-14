import { Component, Prop, State, Host, h } from '@stencil/core';
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

  @State() date: Date;

  componentWillLoad() {
    this.loadTimer();
  }

  loadTimer() {
    let timer = RtTimer.get(this.timeout);
    timer.subscribe((d) => {
      this.date = d
    })
    this.date = timer.state.date
  }

  render() {
    return (
      <Host>
        <div class="pepe">RtTimer Date: {this.date.toISOString()} name: {this.name}</div>
        <button class="button is-primary">example button </button>
      </Host>
    );
  }

}
