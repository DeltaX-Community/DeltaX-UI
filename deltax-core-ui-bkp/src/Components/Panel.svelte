<svelte:options tag="d-panel" />

<script lang="ts">
    export let title: string;
    $: extraClass = $$props.class;
</script>

<div
    class="m-1 rounded-br-2xl rounded-tl-2xl | border-red-900 border-2 bg-blue-50 | wdg-shadow overflow-hidden | {extraClass}"
>
    <div
        class="p-1 bg-red-900 text-white text-center font-semibold font-sans uppercase"
    >
        {title}
    </div>
    <slot name="body">
        <div class="py-2 px-1">
            <slot />
        </div>
    </slot>
</div>

<style>
    @import "/build/global.css";
</style>
