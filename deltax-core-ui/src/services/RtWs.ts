import { Client } from "rpc-websockets";
import { writable, Writable } from "svelte/store";




export interface TopicDto {
    tagName: string;
    status: boolean;
    updated: Date;
    value: string | number;
}

export class RealTimeWebSocket extends Client {
    private timeout: number;

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
        this.Topics = writable({} as { [name: string]: TopicDto });
        this.IsConnected = writable(false);
        this.IsConnected.subscribe(val => this.isConnected = val)

        this.on('open', this.RtOnOpen);
        this.on('close', this.RtOnClose);
        this.on('rt.notify.tags', this.RtOnNotifyTags);
    }

    public KnownTopics: Array<string>;
    public SubscribedTopics: Set<string>;
    public Topics = writable({} as { [name: string]: TopicDto });
    public IsConnected = writable(false);
    private isConnected = false

    private async RtOnClose() {
        console.log("rt on close:");
        this.IsConnected.set(false);
        this.emit("rt.disconnected");
    }

    private async RtOnOpen(result: unknown) {
        console.log("rt on open:", result);
        this.IsConnected.set(true);
        await this.RtGetTopics()
        await this.RtSubscribeTopics();
        this.emit("rt.connected");
    }

    public async RtGetTopics() {
        console.log("call RtGetTopics")
        const tops = await this.call('rpc.rt.get_topics', [], this.timeout) as Array<string>;
        console.log("call RtGetTopics result", tops);
        this.KnownTopics = tops;
        return this.KnownTopics;
    }

    private RtOnNotifyTags(result: { tags: Array<TopicDto> }) {
        this.Topics.update(val => {
            result.tags.forEach(tag => {
                tag.updated = new Date(tag.updated);
                val[tag.tagName] = tag;
            });
            return val;
        });
    }

    public async RtSubscribeOnly(topics: Array<string>) {
        this.Topics.update(val => val = {});
        this.SubscribedTopics = new Set(topics);

        if (this.isConnected) {
            await this.RtSubscribeTopics()
        }
    }

    public async RtAddSubscribe(topics: Array<string>) {
        // si todos los tags a agregar estan subscritos no invoco el comando 
        if (topics.findIndex(t => !this.SubscribedTopics.has(t)) < 0) {
            return;
        }

        this.SubscribedTopics = new Set(topics.concat(Array.from(this.SubscribedTopics)))
        if (this.isConnected) {
            await this.RtSubscribeTopics()
        }
    }

    private async RtSubscribeTopics() {
        const topics = Array.from(this.SubscribedTopics);
        if (topics.length) {
            console.log("******** RtSubscribeTopics topics", topics);
            const resultTags = await this.call('rpc.rt.subscribe', topics, this.timeout) as { tags: Array<TopicDto> };
            console.log("RtSubscribeTopics resultTags", resultTags);

            this.RtOnNotifyTags(resultTags);
        }
    }

    public async RtSetValues(topicValue: Array<{ topic: string; value: string | number | unknown }>) {
        console.log("send RtSetValues", topicValue);
        const result = await this.call('rpc.rt.set_value', topicValue, this.timeout) as boolean;
        console.log("receive RtSetValues", result);

        const toSubscribe = topicValue.map(t => t.topic);
        this.RtAddSubscribe(toSubscribe);
        return result;
    }

    public async HistoryGetTopic(topicName: string) {
        console.log("send HistoryGetTopic", topicName);
        const result = await this.call('rpc.history.get_topic', [topicName]);
        console.log("receive HistoryGetTopic", result);
        return result;
    }
}

// const production = !process.env.ROLLUP_WATCH;
// const scheme = document.location.protocol === "https:" ? "wss" : "ws";
// const port = document.location.port ? ":" + document.location.port : "";
// const connectionUrl = !production
//     ? "ws://localhost:5011/rt"
//     : scheme + "://" + document.location.hostname + port + "/rt";

const connectionUrl = "ws://localhost:5011/rt";
const RtWs = new RealTimeWebSocket(connectionUrl);

export type IRtWs = typeof RtWs
export default RtWs;
