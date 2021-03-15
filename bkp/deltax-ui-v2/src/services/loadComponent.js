import { GetHeader } from "../api/request";

export default function loadComponent(url) {
    return new Promise((resolve, reject) => {
        fetch(url, {headers: GetHeader()})
            .then(result => {
                return result.text();
            })
            .then(txt => {
                const parser = new DOMParser();
                const fragment = parser.parseFromString(txt, 'text/html');
                const originalTemplate = fragment.getElementsByTagName('TEMPLATE')[0];
                let template;
                if (originalTemplate) {
                    template = originalTemplate;
                    // template = document.createElement('template');
                    // template.innerHTML = originalTemplate.innerHTML;
                    // template.id = originalTemplate.id;
                    // document.body.appendChild(template);
                }
                const originalScript = fragment.getElementsByTagName('SCRIPT')[0];
                let script;
                if (originalScript) {
                    script = document.createElement('script');
                    script.innerHTML = originalScript.innerHTML;
                    // document.body.appendChild(script);
                }
                resolve({
                    template,
                    script
                });
            })
            .catch(reject);
    });
}