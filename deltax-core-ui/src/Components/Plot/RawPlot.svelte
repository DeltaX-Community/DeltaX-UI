<svelte:options tag={"dx-raw-plot"} />

<script lang="ts">
    import { onMount, afterUpdate } from "svelte";
    import { Plot } from "./Plot";
    import Common from "../../Settings/Common";

    $: IsDarkMode = Common.IsDarkMode;
    $: dark = $IsDarkMode ? "dark" : "";

    let elPlot;
    let plot: Plot;
    let clientHeight;
    let clientWidth;

    $: if (clientWidth && clientHeight && plot && plot.plot) {
        plot.plot.setSize({
            width: clientWidth - 4,
            height: clientHeight - 24,
        });
    }

    onMount(() => {
        plot = new Plot(clientWidth ?? 400, 100, "El Titulo", $IsDarkMode);
        plot.addSerie("Serie 1", "y");
        plot.addSerie("Serie 2", "y3", { color: "#FFA000" });
        plot.addSerie("Serie 3", "y4", { isString: true, color: "#00A0FF" });

        let serie1 = Array(1000)
            .fill(0)
            .map((e, i) => {
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
            .map((e, i) => {
                return {
                    updated: new Date(Date.now() + (i * 40 - 800) * 1e3),
                    value: `El valor ${i}`,
                };
            });

        plot.init(elPlot);
        plot.setSeriesData([serie1, serie2, serie3]);
    });
</script>

<div class="block {dark}">
    <div
        class="top-1 inset-0"
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
