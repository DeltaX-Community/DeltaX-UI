
const DefaultDarkMode = true;
const RealTimeUrl = "ws://localhost:5011/rt";

// const production = !process.env.ROLLUP_WATCH;
// const scheme = document.location.protocol === "https:" ? "wss" : "ws";
// const port = document.location.port ? ":" + document.location.port : "";
// const RealTimeUrl = !production
//     ? "ws://localhost:5011/rt"
//     : scheme + "://" + document.location.hostname + port + "/rt";


export {
    DefaultDarkMode,
    RealTimeUrl
}