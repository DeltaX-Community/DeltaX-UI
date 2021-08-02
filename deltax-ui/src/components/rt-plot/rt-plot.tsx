import { Component, Listen, Element, Prop, h } from '@stencil/core';
import { Plot } from './Plot';
import Common from '../../services/Common';
import api, { TagValue } from "../../api/request"
import RtTimer from '../../services/RtTimer';
import RtWs from '../../services/RtWs';

@Component({
  tag: 'dx-rt-plot',
  styleUrl: 'rt-plot.css',
  shadow: true,
})

export class DxRtPlot {
  @Element() element: HTMLElement;

  private plotHeight = 200;
  private plotWidth = 400;
  private wrapperEl: HTMLElement;
  private plotEl: HTMLElement;
  private plot: Plot;

  @Prop() baseUrl = "http://127.0.0.1:5010/api/v1";
  @Prop() name: string = "";
  @Prop() tags: string = "";
  @Prop() begin: string = null;
  @Prop() end: string = null;
  @Prop() realtime: boolean = null;
  @Prop() interval: number = null;
  @Prop() period: number = null;
  @Prop() slice: boolean = false;
  @Prop() spark: boolean = false;
  @Prop({ mutable: true }) legendSize: number = 0;
  @Prop({ mutable: true }) legendFloated = false;

  private tagsObj = (this.tags ? JSON.parse(this.tags) : []) as (uPlot.Series & {
    name: string;
    tagName: string;
    axisName: string;
    isString: boolean;
    color?: string;
    scaleOption?: uPlot.Scale;
  })[];

  componentDidLoad() {
    this.wrapperEl = this.element.shadowRoot.querySelector('.plot-wrapper');
    this.plotEl = this.element.shadowRoot.querySelector('.plot-plot');

    setTimeout(() => {
      this.updateSize()
      this.loadPlot(this.plotEl);
    }, 50);
  }

  @Listen('resize', { target: 'window' })
  updateSize() {
    this.legendSize = this.legendFloated || this.spark ? 0 : (this.legendSize || 26);
    this.plotHeight = (this.wrapperEl?.clientHeight || this.plotHeight) - (this.name != "" ? 24 : 0) - this.legendSize;
    this.plotWidth = this.wrapperEl?.clientWidth - 2 || this.plotWidth

    this.plot?.plot?.setSize({
      width: this.plotWidth,
      height: this.plotHeight
    });
  }

  getParams() {
    const params = {
      beginDateTime: new Date(this.begin),
      endDateTime: new Date(this.end),
      maxPoints: 1000,
      lastSeconds: this.period || 90,
      strictMode: false,
    };
    if (!this.begin || !this.end) {
      params.endDateTime = new Date();
      params.beginDateTime = new Date(
        +params.endDateTime - +params.lastSeconds * 1000
      );
    }
    return params;
  }

  updateValuesAllSeries(now: Date) {
    let values = this.tagsObj.map((t) => {
      var tag = RtWs.state[t.tagName];
      return `${tag.value}`;
    });
    this.plot.addPoints(now, values);
  }

  async makeRealTimeSerie() {
    this.interval = this.interval > 100 ? this.interval : 1000;

    const topics = this.tagsObj.map((t) => t.tagName);
    await RtWs.RtAddSubscribe(topics);

    const timer = RtTimer.get(this.interval);
    timer.subscribe((d) => {
      this.updateValuesAllSeries(d);
    });
  }

  async addSeries() {
    for (const serie of this.tagsObj) {
      this.plot.addSerie(serie.name || "", serie.axisName, {
        isString: serie.isString == true,
        color: serie.color,
        scaleOption: serie.scaleOption,
        ...serie,
      });
    }
  }

  async getHistoricAndSetSeries() {
    let seriesDataValues: TagValue[][] = [];
    const params = this.getParams()
    for (const serie of this.tagsObj) {
      const res = await api.GetTopicHistory(this.baseUrl, serie.tagName, { ...params, strictMode: serie.isString != true, });
      seriesDataValues.push(res);
    }

    this.plot.setSeriesData(seriesDataValues);

    if (this.realtime) {
      this.makeRealTimeSerie();
    }
  }


  loadPlot(el: HTMLElement) {
    this.plot = new Plot(this.plotWidth, this.plotHeight, this.name, Common.IsDarkMode, this.slice, this.spark, true, false);

    this.tagsObj = JSON.parse(this.tags);
    if (this.legendFloated) {
      this.plot.setFloatTooltip();
    }
    this.addSeries()
    this.plot.init(el);
    this.getHistoricAndSetSeries();
  }

  render() {
    return (
      <div class={Common.IsDarkMode ? 'dark' : ''} >
        <div class="plot-wrapper" />
        <div class="plot-plot" />
      </div>
    );
  }
}
