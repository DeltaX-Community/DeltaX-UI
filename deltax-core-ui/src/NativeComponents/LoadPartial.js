 export class LoadComponent extends HTMLElement {
     connectedCallback() {
         fetch(this.htmlUrl)
             .then(response => response.text())
             .then(t => {
                 this.loadTemplate(t)
             })
     }

     get htmlUrl() {
         return `/partial/${this.getAttribute('url')}`;
     }

     loadTemplate(tmpl) {
         // const template = document.createElement("template");
         // template.innerHTML = tmpl
         // this.append(template.content.cloneNode(true));
         this.innerHTML = tmpl
     }
 }

 customElements.define("d-load-partial", LoadComponent);