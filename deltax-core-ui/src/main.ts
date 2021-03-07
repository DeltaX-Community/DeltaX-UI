
// export { default as HeaderBar } from "./Components/HeaderBar.svelte";
// export { default as NavBar } from "./Components/NavBar.svelte";
export { default as Meter } from "./Components/Meter.svelte";
export { default as Panel } from "./Components/Panel.svelte";
export { default as RtWs } from "./services/RtWs";
import "./NativeComponents/LoadPartial";

import HeaderBar from "./Components/HeaderBar.svelte";

customElements.define('d-header-bar', HeaderBar as {} as CustomElementConstructor); 
