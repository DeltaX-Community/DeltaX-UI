<svelte:options tag={"dx-data-table"} />

<script lang="ts">
    import Common from "../Settings/Common";

    export let rows: string;
    export let columns: string;
    export let theadclass: string;
    export let tbodyclass: string;
    export let trclass: string;

    $: IsDarkMode = Common.IsDarkMode;
    $: dark = $IsDarkMode ? "dark" : "";

    $: rowsObj = (rows ? JSON.parse(rows) : []) as { [key: string]: unknown }[];
    $: columnsObj = (columns ? JSON.parse(columns) : []) as {
        class?: string;
        label: string;
        field: string;
        "td-class"?: string;
    }[];
</script>

<table class="relative overflow-x-auto | shadow w-full {dark}">
    <thead
        class="items-center {theadclass}"
    >
        {#each columnsObj as col}
            <th class="sticky top-0 | bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-100 shadow capitalize font-bold text-left {col.class}">
                <div contenteditable="false" bind:innerHTML={col.label} />
            </th>
        {/each}
    </thead>
    <tbody class={tbodyclass}>
        {#each rowsObj as row, idx}
            <tr
                class="border-gray-200 dark:border-gray-600 border-b px-3 {trclass}"
            >
                {#each columnsObj as col}
                    <td class={col["tdclass"]}>
                        <div class="m-1"
                            contenteditable="false"
                            bind:innerHTML={row[`${col.field}`]}
                        />
                        <!-- {col.field} - {row.values} -->
                    </td>
                {/each}
            </tr>
        {/each}
    </tbody>
</table>

<style>
    @import "/global.css";
</style>
