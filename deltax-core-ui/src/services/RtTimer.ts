import { readable, Readable } from "svelte/store";


export class Timeout {
    value: Readable<Date> = null

    constructor(timeout: number) {
        this.value = readable(new Date(), function start(set) {
            const interval = setInterval(() => {
                set(new Date());
            }, timeout);

            return function stop() {
                clearInterval(interval);
            };
        });
    }
}

export class RtTimerManager {
    public timers = {} as { [key: string]: Timeout };

    get(name: string, timeout: number = 1000) {
        if (!this.timers[name]) {
            this.timers[name] = new Timeout(timeout)
        }
        return this.timers[name]
    }
}

const RtTimer = new RtTimerManager();

export type IRtTimer = typeof RtTimer
export default RtTimer;

