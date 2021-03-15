<svelte:options tag="dx-rt-value" />

<script lang="ts">
    export let topicname: string;

    import RtWs from "../services/RtWs";

    if (topicname) {
        RtWs.RtAddSubscribe([topicname]);
    }

    let IsConnected = RtWs.IsConnected;
    let Topics = RtWs.Topics;
    $: status = $IsConnected && $Topics[topicname]?.status;
    $: value = $Topics[topicname]?.value ?? "---";
    $: color = status ? "" : "line-through text-red-600";
</script>

<div>
    {#if value == "---"}
        <div class="py-1 px-2 text-red-600">****</div>
    {:else}
        {#key value}
            <div class="animate-color py-1 px-2 {color}">
                {value}
            </div>
        {/key}
    {/if}
</div>

<style>
    @import "/global.css";

    .animate-color {
        animation-name: mymove;
        animation-duration: 1s;
        animation-timing-function: linear;
        animation-delay: 0s;
        animation-direction: alternate;
        animation-iteration-count: 1;
        animation-fill-mode: none;
        animation-play-state: running;
    }

    @keyframes mymove {
        from {
            background-color: rgba(53, 128, 158, 0.856);
            --tw-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06);
            box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000),
                var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
        }
        to {
            background-color: transparent;
        }
    }
</style>
