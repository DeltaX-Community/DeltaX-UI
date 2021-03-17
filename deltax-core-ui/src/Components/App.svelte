<svelte:options tag={"dx-app"} />

<script>
    export var elementid;
    import HeaderBar from "./HeaderBar.svelte";

    let url = "";
    function handleUrl(event) {
        console.log(event.detail);
        url = event.detail?.url?.match("#?(.+)[?]?")[1];
        document
            .getElementById(elementid ?? "element-page")
            ?.setAttribute("url", url);
    }
</script>

<HeaderBar on:item={handleUrl} />

<style>
    @import "/global.css";
</style>
