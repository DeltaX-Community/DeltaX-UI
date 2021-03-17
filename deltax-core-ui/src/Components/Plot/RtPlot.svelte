<svelte:options tag={"dx-rt-plot"} />

<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { Plot } from "./Plot";
    import { GetTopicHistory } from "../../api/request";
    import type { TagValue } from "../../api/request";
    import RtWs from "../../services/RtWs";

    export let baseUrl = "http://127.0.0.1:5010/api/v1";
    export let tags: string;
    $: tagsObj = (tags ? JSON.parse(tags) : []) as {
        name: string;
        tagName: string;
        axisName: string;
        isString: boolean;
        color?: string;
    }[];

    $: Topics = RtWs.Topics;

    export let begin: string;
    export let end: string;
    export let realtime: boolean;
    export let interval: number;

    let timer;
    let elPlot;
    let plot: Plot;
    let clientHeight;
    let clientWidth;
    let initialized = false;

    var getParams = function () {
        const params = {
            beginDateTime: new Date(begin),
            endDateTime: new Date(end),
            maxPoints: 1000,
            lastSeconds: 90,
            strictMode: false,
        };
        if (!begin || !end) {
            params.endDateTime = new Date();
            params.beginDateTime = new Date(
                +params.endDateTime - +params.lastSeconds * 1000
            );
        }
        return params;
    };

    var configureSeries = async function (
        series: {
            name: string;
            axisName: string;
            isString: boolean;
            color?: string;
        }[]
    ) {
        console.log("*** configureSeries", series);
        for (const serie of series) {
            console.log("* addSerie", serie);
            plot.addSerie(serie.name, serie.axisName, {
                isString: serie.isString == true,
                color: serie.color,
            });
        }
    };

    var loadSeries = async function (
        series: { tagName: string; isString: boolean }[]
    ) {
        console.log("*** loadSeries", series);
        let seriesDataValues: TagValue[][] = [];
        for (const serie of series) {
            const res = await GetTopicHistory(baseUrl, serie.tagName, {
                ...getParams(),
                strictMode: serie.isString != true,
            });
            console.log("* loadSeries", serie, res);
            seriesDataValues.push(res);
        }
        console.log("*** loadSeries", seriesDataValues);
        plot.setSeriesData(seriesDataValues);

        if (realtime) {
            makeRealTimeSerie();
        }
    };

    var updateValuesAllSeries = function () {
        const now = new Date();
        let values = tagsObj.map((t) => {
            var tag = $Topics[t.tagName];
            return `${tag.value}`;
        });
        plot.addPoints(now, values);
    };

    var makeRealTimeSerie = async function () {
        interval = interval > 100 ? interval : 1000;
        const topics = tagsObj.map((t) => t.tagName);
        console.log("makeRealTimeSerie", topics);
        await RtWs.RtAddSubscribe(topics);
        timer = setInterval(updateValuesAllSeries, interval);
    };

    onMount(() => {
        plot = new Plot(clientWidth ?? 400, 100, "El Titulo");
    });

    onDestroy(() => {
        console.log("*** Destroy Plot *** ", this.tags);
        plot.plot.destroy();
        clearInterval(this.timer);
        this.timer = null;
    });

    // Update Width and Height on resize
    $: if (clientWidth && clientHeight && plot && plot.plot && initialized) {
        console.log(clientHeight, elPlot.clientHeight, plot.plot.height);
        plot.plot.setSize({
            width: clientWidth,
            height: clientHeight - 24,
        });
    }

    $: if (tagsObj && tagsObj.length && plot && !initialized) {
        configureSeries(tagsObj);
        plot.init(elPlot);
        loadSeries(tagsObj);

        initialized = true;
    }
</script>

<div
    class="absolute inset-0 overflow-hidden"
    bind:clientHeight
    bind:clientWidth
    bind:this={elPlot}
/>

<style>
    @import "/global.css";
    @import "/uplot.css";
</style>
