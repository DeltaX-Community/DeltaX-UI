
import { createStore } from "@stencil/store";


class CommonClass {
    private store = createStore({
        IsDarkMode: false
    });

    constructor(darkMode = false) {
        // detect default mode from media device
        if (window.matchMedia) {
            if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                darkMode = true
            }
            else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
                darkMode = false
            }
        }

        // read config from local storage
        var lsDark = localStorage.getItem('IsDarkMode')
        if (lsDark) {
            darkMode = JSON.parse(lsDark) == true
        }

        let htmlEl = document.getElementsByTagName('html')[0];
        htmlEl.classList.toggle("dark", darkMode)
        htmlEl.setAttribute("data-theme", darkMode ? "dark" : "light");
        this.store.set("IsDarkMode", darkMode)
    }

    public get state() {
        return this.store.state;
    }

    public setDarkMode(darkMode = true) {
        let htmlEl = document.getElementsByTagName('html')[0];
        htmlEl.classList.toggle("dark", darkMode)
        htmlEl.setAttribute("data-theme", darkMode ? "dark" : "light");

        localStorage.setItem('IsDarkMode', JSON.stringify(darkMode))
        this.store.set("IsDarkMode", darkMode)
    }
}

const Common = new CommonClass()
export type ICommon = typeof Common
export default Common;

declare global { interface Window { Common: ICommon; } }
window.Common = Common
