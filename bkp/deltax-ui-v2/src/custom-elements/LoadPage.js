import { GetHeader } from "../api/request";

export class LoadPage extends HTMLElement {
    script = null
    // shadow = null
    wrapper = null
    style = null

    connectedCallback() {
        // this.shadow = this.attachShadow({ mode: 'open' });
        this.wrapper = document.createElement('div');
        this.wrapper.innerHTML = "<p>Loading...</p>"
        this.appendChild(this.wrapper);
    }

    disconnectedCallback() {
        console.log('disconnected from the DOM', this.getAttribute('url'));
         if (this.script) {
             this.removeChild(this.script);
             this.script = null;
        }
        this.removeChild(this.wrapper)
    }

    static get observedAttributes() {
        return ['url'];
    }

    // eslint-disable-next-line 
    attributeChangedCallback(name, oldValue, newValue) {
        this.loadTemplate()
    }

    loadTemplate() {
        const url = this.getAttribute('url');
        console.log('loadTemplate', url);
        fetch(url, {
                headers: GetHeader()
            })
            .then(response => response.text())
            .then(tmpl => {
                const parser = new DOMParser();
                const fragment = parser.parseFromString(tmpl, 'text/html');

                // load TEMPLATE
                const originalTemplate = fragment.getElementsByTagName('TEMPLATE')[0];
                this.wrapper.innerHTML = originalTemplate?.innerHTML || `<p>Fail Loading ${url}!</p>`
 
                // Load SCRIPT
                const originalScript = fragment.getElementsByTagName('SCRIPT')[0];
                if (originalScript) {
                    this.script = document.createElement('script');

                    this.script.innerHTML = originalScript.innerHTML;
                    this.wrapper.appendChild(this.script);
                    console.log('loadTemplate  wrapper SCRIPT', this.script);
                }
            })
    }
}

customElements.define("dx-load-page", LoadPage);