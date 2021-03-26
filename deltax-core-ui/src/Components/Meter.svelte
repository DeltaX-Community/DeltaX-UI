<svelte:options tag={"dx-meter"} />

<script>
    import Common from "../Settings/Common";

    export let topicname;
    export let name;
    export let unit;
    export let color;

    $: IsDarkMode = Common.IsDarkMode;
    $: dark = $IsDarkMode ? "dark" : "";

    if (!color) color = "gray";
    if (!name) name = "---";
</script>

<div class={dark}>
    <div
        class="grid overflow-hidden shadow-mb-xl bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-black"
    >
        <div class="text-center flex-row self-center">
            <span
                class="text-5xl font-bold font-sans break-all text-{color}-700 dark:text-{color}-300 "
            >
                <dx-rt-value {topicname} />
            </span>
            {#if unit}
                <span
                    class="font-sans font-bold text-{color}-700 dark:text-{color}-300"
                >
                    {unit}
                </span>
            {/if}
        </div>
        <div
            class="p-1 self-center text-center font-bold text-gray-800 dark:text-gray-300"
        >
            {name}
        </div>
    </div>
</div>

<style>
    @import "/global.css";
</style>
