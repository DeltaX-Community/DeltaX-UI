
import { createStore } from "@stencil/store";

export type ThemesType = "light" | "dark" | "dark_dimmed"

class CommonClass {
    private store = createStore({
        "data-theme": "light" as ThemesType
    });


    constructor() {
        let theme: ThemesType = "dark";
        // detect default mode from media device
        if (window.matchMedia) {
            if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                theme = "dark"
            }
            else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
                theme = "light";
            }
        }

        // read config from local storage
        const dataTheme = localStorage.getItem('data-theme');
        if (dataTheme) {
            theme = dataTheme as ThemesType
        }

        this.setTheme(theme, false);
    }

    public get state() {
        return this.store.state;
    }

    public get IsDarkMode() {
        return this.store.state["data-theme"] !== "light";
    }

    public setTheme(theme: ThemesType, reload = true) {
        let htmlEl = document.getElementsByTagName('html')[0];

        if (theme == "light") {
            htmlEl.setAttribute("data-color-mode", "light");
            htmlEl.setAttribute("data-light-theme", "light");
            htmlEl.removeAttribute("data-dark-theme")
        }
        else if (theme == "dark") {
            htmlEl.setAttribute("data-color-mode", "dark");
            htmlEl.setAttribute("data-dark-theme", "dark");
            htmlEl.removeAttribute("data-light-theme")
        }
        else if (theme == "dark_dimmed") {
            htmlEl.setAttribute("data-color-mode", "dark");
            htmlEl.setAttribute("data-dark-theme", "dark_dimmed");
            htmlEl.removeAttribute("data-light-theme")
        }

        htmlEl.classList.toggle("dark", theme !== "light");
        localStorage.setItem('data-theme', theme);
        this.store.set("data-theme", theme);

        if (reload) {
            window.location.reload();
        }
    }
}

const Common = new CommonClass()
export type ICommon = typeof Common
export default Common;

declare global { interface Window { Common: ICommon; } }
window.Common = Common
