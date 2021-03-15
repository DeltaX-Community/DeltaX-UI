let objid = 0
const GRID = {
    right: 40,
    axisWidth: 60,
    // axisRight: 40,
    // axisTop: 60,
    left: 10,
    top: 40,
    bottom: 40
};

const defaultYAxis = {
    type: "value",
    scale: true,
    offset: 0,
    position: "left",
    axisLine: {
        onZero: false,
        show: true
    },
    // axisLabel: { formatter: formatterYaxis },
    splitLine: {
        show: true
    },
    axisTick: {
        show:true
    }
};


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

// const globalColorCursor = [
//     "#e31a1c",
//     "#0e1a66",
//     "#cc1ed9",
//     "#ff7f00",
//     "#33a02c",
//     "#6a3d9a",
//     "#b15928",
//     "#1f78b4"
// ];

export class ChartOptions {
    option = {
        animation: false,
        color: colorPalette,
        //  // backgroundColor: "#fea8ef",
        // graph: {
        //     color: colorPalette
        // },
        title: {},
        grid: {
            right: GRID.right,
            left: GRID.left,
            top: GRID.top,
            bottom: GRID.bottom
        },
        tooltip: {
            order: 'valueDesc',
            trigger: 'axis'
        },
        tooltipBkp: {
            trigger: 'axis',
            formatter: function (params) {
                params = params[0];
                const date = new Date(params.name);
                return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + ' : ' + params.value[1];
            },
            axisPointer: {
                animation: false
            }
        },
        legend: {
            left: GRID.left + 10,
            top: GRID.top,
            orient: "vertical",
            align: "left",
            z: 150,
            padding: 10,
            backgroundColor: "rgba(250, 250, 256, 0.8)",
            borderColor: "#892"
        },
        xAxis: {
            type: 'time',
            splitLine: {
                show: true
            }
        },
        yAxis: [{
            type: "value",
            id: "default",
            minInterval: 1,
            axisLabel: {
                show: false
            },
            show: false,
            position: "right",
            offset: 0,
            min: 0,
            max: 10,
            axisLine: {
                onZero: false,
                show: true
            },
            splitLine: {
                show: false
            }
        }],
        series: [{
            id: "cursors",
            type: "line",
            markLine: {
                data: [
                    // { xAxis: 1585348130626, lineStyle: { color: "red" } },
                    // { xAxis: 1585399830626, lineStyle: { color: "blue" } }
                ],
                symbol: ["circle", "none"],
                symbolSize: 20,
                lineStyle: {
                    type: "solid",
                    width: 3,
                    opacity: 0.8
                },
                precision: 20,
                animation: false,
                label: {
                    show: false
                }
            }
        }]
    } 

    get() {
        return this.option;
    }

    getOrAddScale(axisName) {
        const scales = this.option.yAxis;
        console.log("getOrAddScale", axisName, scales);
        let s = scales.find(s => s.id == axisName);
        if (!s) {
            s = Object.assign({}, defaultYAxis, {
                id: axisName,
                name: axisName,
                offset: GRID.axisWidth * (scales.length - 1)
            });
            scales.push(s);
        }

        const width = GRID.axisWidth * (scales.length - 1);
        this.option.grid[defaultYAxis.position] = width;
        this.option.legend[defaultYAxis.position] = width + 10;

        console.log("this.option.grid", this.option.grid);
        return scales.indexOf(s);
    }


    addSerie(name, data, axisName = ' ', options = {}) {
        const yAxisIndex = this.getOrAddScale(axisName)
        const serieIndex = this.option.series.length
        objid++
        this.option.series.push({
            serieIndex: serieIndex,
            yAxisIndex: yAxisIndex, 
            id: `${name}-${serieIndex}-${objid}`,
            name: `${name}-${serieIndex}-${objid}`,
            data: data,
            showSymbol: false,
            hoverAnimation: false,
            type: "line",
            step: "end",
            lineStyle: {
                width: 2
            },
            // tag: tag,  
            isNumeric: true,
            ...options
        })
    }

    addSerieString(name, data, options = {}) {
        const serieIndex = this.option.series.length
        const textYPosition = 1 + this.option.series.filter(i => i.yAxisIndex == 0).length;
        this.option.series.push({
            serieIndex: serieIndex,
            yAxisIndex: 0,
            id: `${name}-${serieIndex}-${objid++}`,
            name: `${name}-${serieIndex}-${objid}`,
            data: data,
            type: "graph",
            showSymbol: true,
            symbol: "diamond",
            borderColor: "#000",
            itemStyle: {
                borderColor: "#000",
                borderWidth: 1
            },
            label: {
                position: "top",
                color: "#000",
                fontWeight: "bold",
                backgroundColor: "#fff"
            },
            symbolSize: 10,
            coordinateSystem: "cartesian2d",
            // tag: tag,   
            isNumeric: false,
            textYPosition: textYPosition,
            ...options
        })
    }
}