<svelte:options tag={"dx-data-table"} />

<script lang="ts">
    export let rows: string;
    export let columns: string;
    export let theadclass: string;
    export let tbodyclass: string;
    export let trclass: string;

    $: rowsObj = (rows ? JSON.parse(rows) : []) as { [key: string]: unknown }[];
    $: columnsObj = (columns ? JSON.parse(columns) : []) as {
        class?: string;
        label: string;
        field: string;
        "td-class"?: string;
    }[];
</script>

<table class="relative overflow-x-auto | shadow w-full">
    <thead class="sticky top-0 | items-center bg-gray-200 shadow {theadclass}">
        {#each columnsObj as col}
            <th
                class="capitalize font-bold text-left text-gray-700 {col.class}"
            >
                <div contenteditable="false" bind:innerHTML={col.label} />
            </th>
        {/each}
    </thead>
    <tbody class={tbodyclass}>
        {#each rowsObj as row, idx}
            <tr
                class="border-gray-200 dark:border-gray-400 border-t border-b px-3 {trclass}"
            >
                {#each columnsObj as col}
                    <td class={col["tdclass"]}>
                        <div
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
