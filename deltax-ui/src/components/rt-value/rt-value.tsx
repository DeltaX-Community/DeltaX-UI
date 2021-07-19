import { Component, Prop, h } from '@stencil/core';
import RtWs from '../../services/RtWs';

@Component({
  tag: 'dx-rt-value',
  styleUrl: 'rt-value.scss',
  shadow: true,
})
export class RtValue {
  @Prop() topicName: string;
  @Prop() inline: boolean = true;
  @Prop() color: string = "inset";
  @Prop() bgColor: string = "transparent";
  @Prop() animateColor: string = "#ffff0083";
  @Prop() animateDuration: string = "1s";

  componentWillLoad() {
    RtWs.RtAddSubscribe([this.topicName]);
  }

  get status() {
    return RtWs.state.IsConnected && RtWs.state[this.topicName]?.status || false;
  }

  get value() {
    return RtWs.state.IsConnected ? RtWs.state[this.topicName]?.value || "---" : "***";
  }

  get style() {
    return {
      "--color": this.status ? (this.color || "inset") : "red",
      "--bg-color": this.bgColor || "transparent",
      "--animate-color": this.animateColor || "red",
      "--animate-duration": this.animateDuration || "1s"
    }
  }

  render() {
    if (this.inline) {
      return (
        <span key={this.value} class="rt-value animate-color" style={this.style}>
          {this.value}
        </span>
      );
    }
    else {
      return (
        <div key={this.value} class="rt-value rt-value-block animate-color" style={this.style}>
          <span> {this.value}</span>
        </div>
      );
    }
  }
}

