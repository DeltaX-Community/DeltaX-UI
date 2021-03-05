 export class LoadComponent extends HTMLElement {
     connectedCallback() {
         this.innerHTML = "<p>Loading...</p>" 
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
                 this.innerHTML = tmpl || `<p>Fail Loading ${url}!</p>`
             })
     }
 }

 customElements.define("d-load-partial", LoadComponent);