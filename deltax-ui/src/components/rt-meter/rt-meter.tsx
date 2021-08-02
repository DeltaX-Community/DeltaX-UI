import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'dx-rt-meter',
  styleUrl: 'rt-meter.scss',
  shadow: true,
})
export class RtMeter {
  @Prop() topicName: string;
  @Prop() name: string;
  @Prop() unit: string;
  @Prop() color: string;
  @Prop() size: "xx-small" | "x-small" | "small" | "medium" | "large" | "x-large" | "xx-large";
  @Prop() bgColor: string;
  @Prop() animateColor: string = "#ffff00aa";
  @Prop() animateDuration: string = "1s";

  get style() {
    let style = { "font-size": this.size || "medium" }
    if (this.color) style["--rt-meter-color"] = this.color
    if (this.bgColor) style["--rt-meter-bg-color"] = this.bgColor
    return style;
  }

  render() {
    return (
      <div class="meter-main" style={this.style} >
        <div class="value">
          <div class="rt-value" >
            <dx-rt-value
              topicName={this.topicName}
              inline={false}
              color={this.color}
              animateColor={this.animateColor}
              animateDuration={this.animateDuration}
            />
          </div>

          {this.unit &&
            <span class="unit">
              {this.unit}
            </span>
          }
        </div>
        <div class="name">
          {this.name || this.topicName}
        </div>
      </div>
    );
  }
}

