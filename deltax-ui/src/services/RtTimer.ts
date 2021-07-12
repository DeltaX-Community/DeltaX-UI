import { createStore, ObservableMap } from "@stencil/store";

export class TimerInterval {
    private store: ObservableMap<{ date: Date }>
    private timer: number;
    private timeout: number;

    constructor(timeout: number) {
        this.store = createStore({} as { date: Date });
        this.timeout = timeout;

        this.timer = setInterval(() => {
            // console.log("TimerInterval", this.timeout, new Date().toISOString())
            this.store.set('date', new Date())
        }, this.timeout);
        this.store.set('date', new Date())
    }

    public get state() {
        return this.store.state;
    }

    public subscribe(cb: (newValue: Date) => void) {
        this.store.onChange("date", cb)
    }

    public dispose() {
        if (this.timer) {
            clearInterval(this.timer);
            this.store.dispose()
            this.timer = 0
        }
    }
}

class RtTimerManager {
    public timers = {} as { [key: number]: TimerInterval };

    get(timeout: number = 1000) {
        if (!this.timers[timeout] && timeout > 50) {
            this.timers[timeout] = new TimerInterval(timeout)
        }
        return this.timers[timeout]
    }
}

const RtTimer = new RtTimerManager();

export type IRtTimer = typeof RtTimer
export default RtTimer;

declare global { interface Window { RtTimer: IRtTimer; } }
window.RtTimer = RtTimer
