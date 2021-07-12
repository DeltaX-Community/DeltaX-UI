import { createStore, ObservableMap } from "@stencil/store";

export interface TopicDto {
    tagName: string;
    status?: boolean;
    updated?: Date;
    value?: string | number;
}

export class RealTimeWebSocket {
    private store: ObservableMap<{ [name: string]: TopicDto }>
    private timer: number;

    constructor() {
        this.store = createStore({} as { [name: string]: TopicDto });

        this.timer = setInterval(() => {
            // console.log("RtWs interval", this.store.state)
            this.store.set('tag1', {
                tagName: 'tag1',
                value: `Date: ${new Date().toISOString()}`
            })
        }, 3000);

        // this.store.on('set', (k, n, o) => this.onSet(k, n, o));
    }

    public get state() {
        return this.store.state;
    }

    public dispose() {
        if (this.timer) {
            clearInterval(this.timer);
            this.store.dispose()
            this.timer = 0
        }
    }

}

const RtWs = new RealTimeWebSocket();

export type IRtWs = typeof RtWs
export default RtWs;

declare global { interface Window { RtWs: IRtWs; } }
window.RtWs = RtWs;