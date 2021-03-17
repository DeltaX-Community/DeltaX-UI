
import { writable, Writable } from "svelte/store";
import { DefaultDarkMode } from "./Config";

// default value
let darkMode = DefaultDarkMode;

// detect default mode from media device
if (window.matchMedia) {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        darkMode = true
    }
    else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
        darkMode = false
    }
}

// read config from session storage
var sessionDark = sessionStorage.getItem('DarkMode')
if (sessionDark) {
    darkMode = JSON.parse(sessionDark) == true
}

document.body.classList.toggle("dark", darkMode)


class CommonClass {
    public IsDarkMode = writable(darkMode);

    public setDarkMode(darkMode = true) {
        document.body.classList.toggle("dark", darkMode)
        sessionStorage.setItem('DarkMode', JSON.stringify(darkMode))
        this.IsDarkMode.set(darkMode)
    }
}

const Common = new CommonClass()
export type ICommon = typeof Common
export default Common;



