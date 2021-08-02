import { Component, Prop, h } from '@stencil/core';
import RtWs from '../../services/RtWs';

@Component({
  tag: 'dx-rt-label',
  styleUrl: 'rt-label.scss',
  shadow: true,
})
export class RtLabel {
  @Prop() topicName: string;

  componentWillLoad() {
    RtWs.RtAddSubscribe([this.topicName]);
  }

  get value() {
    return RtWs.state.IsConnected ? `${RtWs.state[this.topicName]?.value}` || "---" : "***";
  }

  render() {
    return (
      <div key={this.value}>
        <slot name={this.value}></slot>
      </div>
    );
  }
}


