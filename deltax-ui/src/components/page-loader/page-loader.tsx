import { Component, Prop, Listen, Watch, Element, h } from '@stencil/core';
import api from "../../api/request"

@Component({
  tag: 'dx-page-loader',
  styleUrl: 'page-loader.css',
  shadow: false,
})
export class PageLoader {

  @Element() element: HTMLElement;

  @Prop({ reflect: true }) templateUrl = "";
  @Prop() useHash = false;
  @Prop() defaultTemplateUrl = 'home.html';

  private locationHash = "";

  private wrapperEl: HTMLElement;
  private loadingEl: HTMLElement;
  private scriptEl: HTMLScriptElement;

  @Listen('popstate', { target: 'window' })
  handleChangeHash(load = true) {
    if (this.useHash) {
      this.locationHash = location.hash;
      if (load) {
        this.loadTemplate()
      }
    }
  }

  getUrlPath(): string {
    let url = this.useHash ? this.locationHash : this.templateUrl
    if (url && url[0] === "#") {
      url = url.substr(1);
    }

    url = url || "home.tpl.html"
    url = url.endsWith("html") ? url : `${url}.tpl.html`;
    return url || this.defaultTemplateUrl;
  }

  componentDidLoad() {
    this.wrapperEl = this.element.querySelector('.page-loader div.wrapper');
    this.loadingEl = this.element.querySelector('.page-loader div.loading');
    this.handleChangeHash(false)
    this.loadTemplate()
  }

  unload() {
    console.log("Unload")
    if (this.scriptEl) {
      this.scriptEl.remove()
    }
  }

  @Watch("templateUrl")
  async loadTemplate() {

    this.unload()

    let url = this.getUrlPath();
    if (!url) {
      this.wrapperEl.innerHTML = `<p>Page URL not provided...</p>`
      return
    }

    this.loadingEl.classList.add("loading-visible")
    this.loadingEl.classList.remove("loading-hidden")
    this.wrapperEl.innerHTML = `<p>Loading Page ${url}...</p>`

    console.log('loadTemplate', url);
    try {
      let res = await fetch(url, { headers: api.GetHeader() })

      if (res.ok) {
        let tmpl = await res.text()
        const parser = new DOMParser();
        const fragment = parser.parseFromString(tmpl, 'text/html');

        // load TEMPLATE
        const originalTemplate = fragment.getElementsByTagName('TEMPLATE')[0];
        this.wrapperEl.innerHTML = originalTemplate?.innerHTML || `<div class="load-page-fail">Fail Loading page: '${url}'. Template bad format!</div>`

        // Load SCRIPT
        const originalScript = fragment.getElementsByTagName('SCRIPT')[0];
        if (originalScript) {
          this.scriptEl = document.createElement('script');
          this.scriptEl.innerHTML = originalScript.innerHTML;
          this.wrapperEl.appendChild(this.scriptEl);
        }
      }
      else {
        this.wrapperEl.innerHTML = `<div class="load-page-fail">Fail Loading '${url}'. Template not found!</div>`
      }
    }
    finally {
      setTimeout(() => {
        this.loadingEl.classList.remove("loading-visible")
        this.loadingEl.classList.add("loading-hidden")
      }, 50);
    }
  }

  render() {
    return (
      <div class="page-loader">
        <div class="loading"></div>
        <div class="wrapper"></div>
      </div>
    );
  }
}
