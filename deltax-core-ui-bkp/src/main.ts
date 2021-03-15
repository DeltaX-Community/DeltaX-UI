import "./NativeComponents/LoadPartial";
import RtWs from "./services/RtWs";
window.RtWs = RtWs

export { default as App } from "./Components/App.svelte";
export { default as Meter } from "./Components/Meter.svelte";
export { default as Panel } from "./Components/Panel.svelte";
