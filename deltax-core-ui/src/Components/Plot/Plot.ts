import uPlot from "uplot";

export interface TagValue {
    updated: Date;
    value: string;
}




// http://phrogz.net/css/distinct-colors.html
const colorPalette = [
    "#ff4124",
    "#245eff",
    "#d91e69",
    "#19b356",
    "#0e6660",
    "#99ff24",
    "#8c7f4a",
    "#ffb624",
    "#b2755f",
    "#9c73d9",
    "#222a40",
    "#73d9c4",
    "#364022",
    "#402d09",
    "#ff87c7",
    "#2d19b3",
    "#739cd9",
    "#0e1a17",
    "#748c14",
    "#b26b19",
    "#8c2414",
    "#660e54",
    "#4a4a8c",
    "#0e4966",
    "#fff024",
    "#ff7b24",
    "#401009",
    "#cc1ed9",
    "#0e1a66",
    "#5fa2b3",
    "#8c7f4a",
    "#66310e",
    "#8c4a53",
    "#18041a",
    "#ff8787"
];


// converts the legend into a simple tooltip
function moveLegendAsTooltipPlugin(className: string = "") {
    let legendEl;
    let overEl;

    function init(u: uPlot) {
        console.log("init u", u)
        legendEl = u.root.querySelector(".u-legend");
        overEl = u.root.querySelector(".u-over");

        legendEl.classList.remove("u-inline");
        className && legendEl.classList.add(className);

        legendEl?.classList?.add("float-legend")
    }

    function update(u: uPlot) {
        const {
            left,
            top
        } = u.cursor;

        // console.log(u.root.clientWidth, legendEl.clientWidth, left, overEl.clientWidth)
        // Move Legend
        if (left > 0 && left > (overEl.clientWidth - legendEl.clientWidth)) {
            legendEl.style.transform = `translate(-${overEl.clientWidth - legendEl.clientWidth}px, 0px)`;
        } else if (legendEl.style.transform) {
            legendEl.style.transform = null;
        }
    }

    return {
        hooks: {
            init: init,
            setCursor: update,
        }
    };
}



export class Plot {

    public plot: uPlot;
    public options: uPlot.Options;
    public data: uPlot.AlignedData;
    private xValues: number[];
    private seriesData: uPlot.AlignedData;
    private seriesDataString: { [key: string]: string[] };
    private localTz = new Intl.DateTimeFormat().resolvedOptions().timeZone;
    private fmtDate = uPlot.fmtDate('{YYYY}-{MM}-{DD} {HH}:{mm}:{ss}.{fff}')
    private defaultAxes = {}
    private spark = false;
    private slice = false;
    private syncPlot = uPlot.sync("syncPlot");
    private overEl: Element;
    private cursorToEnd = false;

    constructor(
        width: number,
        height: number,
        title: string,
        dark: boolean = false,
        slice: boolean = false,
        spark: boolean = true,
        cursorToEnd: boolean = false,
        syncCursor: boolean = false) {

        this.defaultAxes = {
            stroke: dark ? "#c7d0d9" : "#3c3245",
            grid: {
                stroke: "#5c526550",
                width: 1
            },
            ticks: {
                stroke: "#5c526550",
                width: 1
            }
        }

        this.options = {
            width,
            height,
            title,
            plugins: [],
            hooks: {},
            cursor: {
                points: {
                    size: 10,
                    width: 2,
                    // @ts-ignore: Unreachable code error 
                    stroke: (u, seriesIdx) => u.series[seriesIdx].pointFill,
                    //  fill: (u, seriesIdx) => u.series[seriesIdx].points.stroke(u, seriesIdx), //"#00550088",
                },
                dataIdx: (self, seriesIdx, hoveredIdx) => {
                    let seriesData = self.data[seriesIdx];

                    if (seriesData[hoveredIdx] == null) {
                        let nonNullLft = hoveredIdx,
                            nonNullRgt = hoveredIdx,
                            i;

                        i = hoveredIdx;
                        while (nonNullLft == hoveredIdx && i-- > 0)
                            if (seriesData[i] != null)
                                nonNullLft = i;
                        return nonNullLft;
                    }

                    return hoveredIdx;
                }
            },
            scales: {
                x: {
                    time: true,
                },
                yString: {
                    time: false,
                    range: [-1, 20]
                },
                ySpark: {
                    time: false,
                    auto: true,
                    range: [-0.1, 1.1]
                },
            },
            axes: [
                Object.assign({}, this.defaultAxes,
                    {
                        scale: "x",
                        side: 2
                    }),
                Object.assign({}, this.defaultAxes,
                    {
                        scale: "yString",
                        side: 1,
                        show: true,
                        grid: { show: false },
                        size: 1
                    })],
            series: [{}]
        }

        if (spark) {
            this.options.axes.forEach(a => {
                a.show = false
            })
            this.options.legend = { show: false }
            this.options.cursor.show = false
        }
        else {
            // this.options.plugins.push(moveLegendAsTooltipPlugin())
        }

        if (syncCursor) {
            this.options.cursor.sync = {
                key: this.syncPlot.key,
                setSeries: true
            }
        }

        this.options.series[0].value = (u: uPlot, rv: number, sidx: number, idx: number) => this.getTime(u, sidx, idx);
        this.spark = spark;
        this.slice = slice;
        this.cursorToEnd = cursorToEnd;
        this.seriesDataString = {}
        this.xValues = [];
        this.seriesData = [this.xValues]
    }

    public init(el: HTMLElement) {
        this.plot = new uPlot(this.options, this.seriesData, el);
        this.overEl = this.plot.root.querySelector(".u-over");

        if (this.cursorToEnd) {
            this.overEl.addEventListener("mouseenter", () => {
                this.cursorToEnd = false
            });
            this.overEl.addEventListener("mouseleave", () => {
                this.cursorToEnd = true;
                this.plot.setCursor({ left: this.overEl.clientWidth, top: -1 })
            });
        }
    }


    private addScale(scaleName: string) {
        let scale = this.options.scales[scaleName];
        if (!scale) {
            this.options.scales[scaleName] = {
                auto: true,
                time: false,
                distr: 1
            }
            this.options.axes.push(Object.assign({}, this.defaultAxes,
                {
                    scale: scaleName,
                    side: 3,
                    show: this.spark == false
                }))
        }
    }

    private getTime(u: uPlot, sidx: number, idx: number) {
        return `${this.xValues[idx] ? this.fmtDate(uPlot.tzDate(new Date(this.xValues[idx] * 1e3), this.localTz)) : '---'}`
    }

    private valueTable(u: uPlot, sidx: number, idx: number) {
        const time = `${this.xValues[idx] ? this.fmtDate(uPlot.tzDate(new Date(this.xValues[idx] * 1e3), this.localTz)) : '---'}`
        return { Time: time, Value: this.getValue(u, sidx, idx) }
    }

    private getValue(u: uPlot, sidx: number, idx: number) {
        const serie = this.options.series[sidx];
        const value = serie["isString"]
            ? `${this.seriesDataString[sidx] ? this.seriesDataString[sidx][idx] : 'NULL'}`
            : `${this.seriesData[sidx] ? this.seriesData[sidx][idx] : 'NaN'}`
        return value
    }

    public addSerie(name: string, scale = null, options = {} as { isString?: boolean, color?: string }) {
        scale = scale || (this.spark ? "ySpark" : "y")
        this.addScale(scale)
        const color = options.color || colorPalette[this.options.series.length]
        const isString = options.isString == true
        const extraOptions = {
            isString: isString,
            pointFill: isString ? `${color}FF` : `${color}2f`,
            ...options
        }

        if (extraOptions.isString) {
            this.options.series.push({
                scale: "yString",
                label: name,
                stroke: color,
                fill: `${color}1f`,
                paths: u => null,
                points: {
                    space: 2,
                    size: 10,
                    show: true,
                    width: 2
                },
                value: (u: uPlot, rv: number, sidx: number, idx: number) => this.getValue(u, sidx, idx),
                // values: (u: uPlot, sidx: number, idx: number) => this.valueTable(u, sidx, idx),
                ...extraOptions
            })
        } else {
            this.options.series.push({
                scale: scale,
                label: name,
                stroke: color,
                fill: `${color}1A`,
                width: 2,
                paths: uPlot.paths.stepped({
                    align: 1
                }),
                points: {
                    show: false
                },
                // values: (u: uPlot, sidx: number, idx: number) => this.valueTable(u, sidx, idx),
                ...extraOptions
            })
        }
    }

    public setSeriesData(seriesDataValues: TagValue[][]) {
        this.xValues = seriesDataValues[0].map(d => d.updated.getTime() / 1000)

        var yy = seriesDataValues.map((s, si) => {
            const serie = this.options.series[si + 1];
            if (serie["isString"]) {
                var xTime = s.map(r => r.updated.getTime() / 1000);
                var y: number[] = []
                var yStr = this.seriesDataString[`${si + 1}`] = []
                let i = 0;
                this.xValues.forEach((x, iv) => {
                    if (x >= xTime[i] && s[i]) {
                        y.push(si + 1)
                        yStr.push(s[i].value)
                        i++;
                    }
                    else {
                        yStr.push(null)
                        y.push(null)
                    }
                })

                return y;
            } else {
                return s.map(r => Number.parseFloat(r.value))
            }
        })

        this.seriesData = [this.xValues, ...yy]
        this.plot.setData(this.seriesData, true)

    }

    private interval = 0
    public sliceData() {
        if (!this.interval) {
            this.interval = this.xValues[this.xValues.length - 1] - this.xValues[0]
        }

        let begin = this.xValues[this.xValues.length - 1] - this.interval
        let i = 0;

        for (i = 0; i < this.xValues.length && this.xValues[i] < begin; i++) { }

        for (let si = 0; si < this.seriesData.length; si++) {
            this.seriesData[si] = this.seriesData[si].slice(i);
            if (this.options.series[si]["isString"]) {
                this.seriesDataString[si] = this.seriesDataString[si].slice(i);
            }
        }

        this.xValues = this.seriesData[0]
    }

    findLastNotNull(array: string[]) {
        for (let i = array.length - 1; i >= 0; --i) {
            if (array[i]) {
                return array[i];
            }
        }
    }


    public addPoints(updated: Date, seriesPoint: (string | null)[]) {
        this.xValues.push(updated.getTime() / 1000)

        seriesPoint.forEach((val, si) => {
            const serie = this.options.series[si + 1];
            if (serie["isString"]) {
                const yStr = this.seriesDataString[`${si + 1}`]
                const lastVal = this.findLastNotNull(yStr)
                if (lastVal != val) {
                    yStr.push(val)
                    this.seriesData[si + 1].push(si + 1)
                }
                else {
                    yStr.push(null)
                    this.seriesData[si + 1].push(null)
                }
            }
            else {
                this.seriesData[si + 1].push(Number.parseFloat(val))
            }
        })

        if (this.slice) {
            this.sliceData()
        }
        this.plot.setData(this.seriesData)

        if (this.cursorToEnd) {
            this.plot.setCursor({ left: this.overEl.clientWidth, top: -1 })
        }
    }
}