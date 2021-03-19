import { GetHeader } from "../api/request";

export class LoadPage extends HTMLElement {
    script = null
    wrapper = null
    loading = null

    connectedCallback() {
        this.wrapper = document.createElement('div');
        this.loading = document.createElement('div');
        this.appendChild(this.loading)
        this.appendChild(this.wrapper);
        this.loadTemplate()
    }

    disconnectedCallback() {
        // console.log('disconnected from the DOM', this.getAttribute('url'));
        if (this.script) {
            this.removeChild(this.script);
            this.script = null;
        }
        this.removeChild(this.wrapper)
        this.removeChild(this.loading) 
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
        if (!url || url == '') {
            return
        }

        this.loading.classList.add("load-page-loading")
        this.loading.classList.add("loading-visible")
        this.loading.classList.remove("loading-hidden")  
        this.wrapper.innerHTML = `<div class="load-page-wait">Loading ${url}!</div>`

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
                this.wrapper.innerHTML = originalTemplate?.innerHTML || `<div class="load-page-fail">Fail Loading ${url}!</div>`

                // Load SCRIPT
                const originalScript = fragment.getElementsByTagName('SCRIPT')[0];
                if (originalScript) {
                    this.script = document.createElement('script');
                    this.script.innerHTML = originalScript.innerHTML;
                    this.wrapper.appendChild(this.script);
                    // console.log('loadTemplate  wrapper SCRIPT', this.script);  
                }
            })
            .finally(() => {
                setTimeout(() => {
                    this.loading.classList.remove("loading-visible")
                    this.loading.classList.add("loading-hidden")  
                }, 50);
            })
    }
}

