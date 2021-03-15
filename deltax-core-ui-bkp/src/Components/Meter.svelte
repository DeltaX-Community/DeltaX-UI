<svelte:options tag="d-meter" />

<script lang="ts">
    export let topicname: string;
    export let name: string = null;
    export let unit: string = null;

    import RtWs from "../services/RtWs";
    import { Topics, IsConnected } from "../services/RtWs";

    if ($IsConnected) {
        RtWs.RtAddSubscribe([topicname]);
    }
    RtWs.on("rt.connected", function () {
        RtWs.RtAddSubscribe([topicname]);
    });

    $: color =
        $IsConnected && $Topics[topicname]?.status
            ? "text-indigo-900"
            : "text-red-600";
    $: value = $Topics[topicname]?.value ?? "---";

    var prevValue = value;
    $: if (prevValue != value) {
        prevValue = value;
    }
</script>

<!-- <p>meter:{topicname}: {JSON.stringify($Topics[topicname])}</p>
    <p>meter:{topicname}: {$Topics[topicname]?.value}</p>
    <pre>JSON---{JSON.stringify($Topics)}</pre> -->

<div
    class="flex flex-row items-stretch overflow-hidden | rounded-md border-2 border-blue-600"
>
    <div class="w-1/3 py-1 px-2 bg-blue-600 text-white font-bold">
        {name ?? topicname}
    </div>
    {#key prevValue}
        <div
            class="animate-color py-1 flex-grow px-2 auto-cols-max font-bold {color} | shadow-inner"
        >
            {value}
        </div>
    {/key}
    <div class="py-1 px-2">{unit ?? ""}</div>
</div>

<style>
    @import "/build/global.css";

    .animate-color {
        animation-name: mymove;
        animation-duration: 2s;
        animation-timing-function: linear;
        animation-delay: 0s;
        animation-direction: alternate;
        animation-iteration-count: 1;
        animation-fill-mode: none;
        animation-play-state: running;
    }

    @keyframes mymove {
        from {
            background-color: rgba(179, 207, 18, 0.644);
        }
        to {
            background-color: white;
        }
    }
</style>
