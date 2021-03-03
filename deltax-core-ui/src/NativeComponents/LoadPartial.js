import "alpinejs";

const template = document.createElement("template");
template.innerHTML = ` 
    <div x-data x-init="fetch($el.parentElement.url)
        .then(response => response.text())
        .then(response => { $refs.dropdown.innerHTML = response })">
        <div x-ref="dropdown">
        Loading Data...
        </div>
    </div>   
`;

export class LoadPartial extends HTMLElement {
    connectedCallback() {
        this.append(template.content.cloneNode(true));
    }

    get url() {
        return `/partial/${this.getAttribute('url')}`;
    }
}

customElements.define("d-load-partial", LoadPartial);