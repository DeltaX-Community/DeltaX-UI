import RtWs from "./services/RtWs";
window.RtWs = RtWs

import * as Api from "./api/request";
window.Api = Api


import { LoadPage } from "./Components/LoadPage";
customElements.define("dx-load-page", LoadPage);

export { default as App } from "./Components/App.svelte";
export { default as HeaderBar } from "./Components/HeaderBar.svelte";
export { default as RtValue } from "./Components/RtValue.svelte";
export { default as DataTable } from "./Components/DataTable.svelte";
export { default as Meter } from "./Components/Meter.svelte";
export { default as RawPlot } from "./Components/Plot/RawPlot.svelte";
export { default as RtPlot } from "./Components/Plot/RtPlot.svelte";
