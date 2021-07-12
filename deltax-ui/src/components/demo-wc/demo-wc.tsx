import { Component, Prop, State, Host, h } from '@stencil/core';
import RtTimer from '../../services/RtTimer';

@Component({
  tag: 'demo-wc',
  styleUrl: 'demo-wc.css',
  shadow: true,
})
export class DemoWc {
  /**
   * The first name
   */
  @Prop() first: string;
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
        <div>RtTimer Date: {this.date.toISOString()}</div>
      </Host>
    );
  }

}
