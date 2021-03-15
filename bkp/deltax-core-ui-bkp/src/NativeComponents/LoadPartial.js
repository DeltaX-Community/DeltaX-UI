 export class LoadComponent extends HTMLElement {
     connectedCallback() {
         this.innerHTML = "<p>Loading...</p>"
         if (this.hasAttribute("url") && this.getAttribute('url')) {
             this.loadTemplate()
         }
     }

     static get observedAttributes() {
         return ['url'];
     }

     attributeChangedCallback(name, oldValue, newValue) {
         this.loadTemplate()
     }

     loadTemplate() {
         const url = `/partial/${this.getAttribute('url')}`;
         console.log('loadTemplate', url);
         fetch(url)
             .then(response => response.text())
             .then(tmpl => {
                 const parser = new DOMParser();
                 const fragment = parser.parseFromString(tmpl, 'text/html');
                 const originalScript = fragment.getElementsByTagName('SCRIPT')[0];
                 if (originalScript) {
                     var script = document.createElement('script');
                     script.innerHTML = originalScript.innerHTML;
                     document.body.appendChild(script);
                     console.log('loadTemplate  script', script); 
                 }

                 this.innerHTML = tmpl || `<p>Fail Loading ${url}!</p>`
             })
     }
 }

 customElements.define("d-load-partial", LoadComponent);