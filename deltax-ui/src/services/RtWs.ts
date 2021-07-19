import { RealTimeUrl } from "../settings/Config"
import { Client } from "rpc-websockets";
import { createStore, ObservableMap } from "@stencil/store";


export interface TopicDto {
    tagName: string;
    status?: boolean;
    updated?: Date;
    value?: string | number;
}
export class RealTimeWebSocket extends Client {
    private timeout: number;
    private store: ObservableMap<{ [name: string]: TopicDto } & { "IsConnected": boolean }>
    public KnownTopics: Array<string>;
    public SubscribedTopics: Set<string>;

    constructor(
        address?: string,
        options?: {
            autoconnect?: boolean;
            reconnect?: boolean;
            reconnect_interval?: number;
            max_reconnects?: number;
        }) {
        super(address, options);

        this.timeout = 10000;
        this.KnownTopics = [];
        this.SubscribedTopics = new Set();
        this.store = createStore({ IsConnected: false } as { [name: string]: TopicDto } & { IsConnected: boolean; });

        this.on('open', this.RtOnOpen);
        this.on('close', this.RtOnClose);
        this.on('rt.notify.tags', this.RtOnNotifyTags);
    }

    private async RtOnClose() {
        console.log("rt on close:");
        this.store.set("IsConnected", false);
        this.emit("rt.disconnected");
    }

    private async RtOnOpen(result: unknown) {
        console.log("rt on open:", result);
        this.store.set("IsConnected", true);
        await this.RtGetTopics()
        await this.RtSubscribeTopics();
        this.emit("rt.connected");
    }

    public async RtGetTopics() {
        const tops = await this.call('rpc.rt.get_topics', [], this.timeout) as Array<string>;
        console.log("call RtGetTopics result", tops);
        this.KnownTopics = tops;
        return this.KnownTopics;
    }

    private RtOnNotifyTags(result: { tags: Array<TopicDto> }) {
        result.tags.forEach(tag => {
            tag.updated = new Date(tag.updated);
            this.store.set(tag.tagName, tag);
        });
    }

    public async RtSubscribeOnly(topics: Array<string>) {
        this.SubscribedTopics = new Set(topics);

        this.store.reset();

        if (this.store.get("IsConnected")) {
            await this.RtSubscribeTopics()
        }
    }

    public async RtAddSubscribe(topics: Array<string>) {
        // si todos los tags a agregar estan subscritos no invoco el comando 
        if (topics.findIndex(t => !this.SubscribedTopics.has(t)) < 0) {
            return;
        }

        this.SubscribedTopics = new Set(topics.concat(Array.from(this.SubscribedTopics)))
        if (this.store.get("IsConnected")) {
            await this.RtSubscribeTopics()
        }
    }

    private async RtSubscribeTopics() {
        const topics = Array.from(this.SubscribedTopics);
        if (topics.length) {
            // console.log("******** RtSubscribeTopics topics", topics);
            const resultTags = await this.call('rpc.rt.subscribe', topics, this.timeout) as { tags: Array<TopicDto> };
            console.log("RtSubscribeTopics resultTags", resultTags);

            this.RtOnNotifyTags(resultTags);
        }
    }

    public async RtSetValues(topicValue: Array<{ topic: string; value: string | number | unknown }>) {
        const result = await this.call('rpc.rt.set_value', topicValue, this.timeout) as boolean;

        const toSubscribe = topicValue.map(t => t.topic);
        this.RtAddSubscribe(toSubscribe);
        return result;
    }

    public async HistoryGetTopic(topicName: string) {
        const result = await this.call('rpc.history.get_topic', [topicName]);
        console.log("receive HistoryGetTopic", result);
        return result;
    }

    public get state() {
        return this.store.state;
    }
}

const RtWs = new RealTimeWebSocket(RealTimeUrl);

export type IRtWs = typeof RtWs
export default RtWs;

declare global { interface Window { RtWs: IRtWs; } }
window.RtWs = RtWs;

