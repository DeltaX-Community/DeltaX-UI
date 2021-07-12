import { Component, Prop, State, Listen, Element, Host, h } from '@stencil/core';
import { Plot } from './Plot';
import Common from '../../services/Common';

@Component({
  tag: 'dx-plot-raw',
  styleUrl: 'dx-plot-raw.css',
  shadow: true,
})

export class DxPlotRaw {
  /**
   * The first name
   */
  @Prop() first: string;
  @Prop() timeout: number = 2000;
  @Element() element: HTMLElement;
  @State() date: Date;

  private plotHeight = 200;
  private plotWidth = 400;
  private wrapperEl: HTMLElement;
  private plotEl: HTMLElement;
  private plot: Plot;

  componentDidLoad() {
    console.log("componentDidLoad", this.element); // outputs HTMLElement <my-component ... 
    this.wrapperEl = this.element.shadowRoot.querySelector('.plot-wrapper');
    this.plotEl = this.element.shadowRoot.querySelector('.plot-plot');

    this.plotHeight = this.wrapperEl?.clientHeight || this.plotHeight
    this.plotWidth = this.wrapperEl?.clientWidth - 2 || this.plotWidth

    this.loadPlot(this.plotEl);

  }

  @Listen('resize', { target: 'window' })
  handleResize(ev) {
    console.log('handleResize ', ev);
    this.plotHeight = this.wrapperEl?.clientHeight || this.plotHeight
    this.plotWidth = this.wrapperEl?.clientWidth - 2 || this.plotWidth

    this.plot.plot.setSize({
      width: this.plotWidth,
      height: this.plotHeight
    });
  }
 
  loadPlot(el: HTMLElement) {
    this.plot = new Plot(this.plotWidth, this.plotHeight, null, Common.state.IsDarkMode, false, false);

    this.plot.addSerie("Serie 1", "y");
    this.plot.addSerie("Serie 2", "y3", { color: "#FFA000" });
    this.plot.addSerie("Serie 3", "y4", { isString: true, color: "#00A0FF" });

    let serie1 = Array(1000)
      .fill(0)
      .map((_e, i) => {
        return {
          updated: new Date(Date.now() + (i - 1000) * 1e3),
          value: `${i}`,
        };
      });

    let serie2 = serie1.map((v, i) => {
      return {
        updated: v.updated,
        value: `${125 - i * 0.25 + (i % 100)}`,
      };
    });

    let serie3 = Array(10)
      .fill(0)
      .map((_e, i) => {
        return {
          updated: new Date(Date.now() + (i * 40 - 800) * 1e3),
          value: `El valor ${i}`,
        };
      });

    this.plot.init(el);
    this.plot.setSeriesData([serie1, serie2, serie3]);
  }

  render() {
    return (
      <Host>
        <div class={Common.state.IsDarkMode ? 'dark' : ''} >
          <div class="plot-wrapper" />
          <div class="plot-plot" />
        </div>
      </Host>
    );
  }

}
