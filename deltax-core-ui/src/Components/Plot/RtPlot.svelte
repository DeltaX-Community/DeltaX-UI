<svelte:options tag={"dx-rt-plot"} />

<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { Plot } from "./Plot";
    import { GetTopicHistory } from "../../api/request";
    import type { TagValue } from "../../api/request";
    import RtWs from "../../services/RtWs";
    import Common from "../../Settings/Common";

    $: IsDarkMode = Common.IsDarkMode;
    $: dark = $IsDarkMode ? "dark" : "";

    export let baseUrl = "http://127.0.0.1:5010/api/v1";
    export let tags: string = null;
    $: tagsObj = (tags ? JSON.parse(tags) : []) as {
        name: string;
        tagName: string;
        axisName: string;
        isString: boolean;
        color?: string;
    }[];

    export let begin: string = null;
    export let end: string = null;
    export let realtime: boolean = null;
    export let interval: number = null;

    $: Topics = RtWs.Topics;

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
        for (const serie of series) {
            plot.addSerie(serie.name, serie.axisName, {
                isString: serie.isString == true,
                color: serie.color,
            });
        }
    };

    var loadSeries = async function (
        series: { tagName: string; isString: boolean }[]
    ) {
        let seriesDataValues: TagValue[][] = [];
        for (const serie of series) {
            const res = await GetTopicHistory(baseUrl, serie.tagName, {
                ...getParams(),
                strictMode: serie.isString != true,
            });
            seriesDataValues.push(res);
        }
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
        await RtWs.RtAddSubscribe(topics);
        timer = setInterval(updateValuesAllSeries, interval);
    };

    onMount(() => {
        plot = new Plot(clientWidth ?? 400, 100, "El Titulo", $IsDarkMode);
    });

    onDestroy(() => {
        plot.plot.destroy();
        clearInterval(this.timer);
        this.timer = null;
    });

    // Update Width and Height on resize
    $: if (
        clientWidth &&
        clientHeight &&
        elPlot &&
        plot &&
        plot.plot &&
        initialized
    ) {
        // console.log( "resize",  clientHeight, elPlot.clientHeight, plot.plot.height );
        plot.plot.setSize({
            width: clientWidth - 4,
            height: clientHeight - 24,
        });
    }

    $: if (tagsObj && tagsObj.length && plot && !initialized) {
        configureSeries(tagsObj);
        plot.init(elPlot);
        initialized = true;

        loadSeries(tagsObj);
    }
</script>

<div class="block {dark}">
    <div
        class="top-0 inset-0 overflow-hidden"
        style="position: absolute; z-index: -1;"
        bind:clientHeight
        bind:clientWidth
    />

    <div class="absolute inset-0" bind:this={elPlot} />
</div>

<style>
    @import "/global.css";
    @import "/uplot.css";
</style>
