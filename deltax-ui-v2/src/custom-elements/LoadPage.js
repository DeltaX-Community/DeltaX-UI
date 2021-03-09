
import { GetHeader } from "../api/request";
export class LoadPage extends HTMLElement {
     connectedCallback() {
         this.innerHTML = "<p>Loading...</p>" 
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
         fetch(url, {headers: GetHeader()})
             .then(response => response.text())
             .then(tmpl => {
                 const parser = new DOMParser();
                 const fragment = parser.parseFromString(tmpl, 'text/html');

                 // load template
                 const originalTemplate = fragment.getElementsByTagName('TEMPLATE')[0];
                 this.innerHTML = originalTemplate?.innerHTML || `<p>Fail Loading ${url}!</p>`

                 // Load script
                 const originalScript = fragment.getElementsByTagName('SCRIPT')[0];  
                 if (originalScript) {
                     const script = document.createElement('script');
                     script.innerHTML = originalScript.innerHTML;
                     document.body.appendChild(script);
                     console.log('loadTemplate  script', script); 
                 }
             })
     }
 }

customElements.define("dx-load-page", LoadPage);