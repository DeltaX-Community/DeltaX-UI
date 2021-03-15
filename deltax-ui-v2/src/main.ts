import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vueCustomElement from 'vue-custom-element'
import './assets/tailwind.css'

Vue.use(vueCustomElement);
Vue.config.productionTip = false

import "./custom-elements/LoadPage.js"

import DemoBasic from "./components/DemoBasic.vue";
Vue.customElement('demo-basic', DemoBasic);

import Meter from "./components/Meter.vue";
Vue.customElement('dx-meter', Meter);

import RtValue from "./components/RtValue.vue";
Vue.customElement('dx-rt-value', RtValue);

import DataTable from "./components/DataTable.vue";
Vue.customElement('dx-data-table', DataTable);

import RawPlot from "./components/plot/RawPlot.vue";
Vue.customElement('dx-raw-plot', RawPlot);

import RtPlot from "./components/plot/RtPlot.vue";
Vue.customElement('dx-rt-plot', RtPlot, { shadow: true });

// import RtPlot2 from "./components/plot2/RtPlot2.vue";
// Vue.customElement('dx-rt-plot2', RtPlot2);

import RtWs from "./services/RtWs";
window.RtWs = RtWs

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

