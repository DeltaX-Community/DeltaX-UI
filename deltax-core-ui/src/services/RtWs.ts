import { Client } from "rpc-websockets";
import { writable, Writable } from "svelte/store";

const Topics = writable({} as { [name: string]: TopicDto });
const IsConnected = writable(false);

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
        this.NameTopics = new Set();

        this.on('open', this.RtOnOpen);
        this.on('close', this.RtOnClose);
        this.on('rt.notify.tags', this.RtOnNotifyTags);
    }

    public KnownTopics: Array<string>;
    public NameTopics: Set<string>;

    private async RtOnClose() {
        console.log("rt on close:");
        IsConnected.set(false);
        this.emit("rt.disconnected");
    }

    private async RtOnOpen(result: unknown) {
        console.log("rt on open:", result);
        IsConnected.set(true);
        await this.RtGetTopics()
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
        Topics.update(val => {
            result.tags.forEach(tag => {
                tag.updated = new Date(tag.updated);
                val[tag.tagName] = tag;
                this.NameTopics.add(tag.tagName);
            });
            return val;
        });
    }

    public async RtSubscribe(topics: Array<string>) {
        console.log("rpc.rt.subscribe topics", topics);
        const resultTags = await this.call('rpc.rt.subscribe', topics, this.timeout) as { tags: Array<TopicDto> };
        console.log("rpc.rt.subscribe resultTags", resultTags);

        console.log("Object.keys(Topics)", Object.keys(Topics))

        this.NameTopics = new Set();
        Topics.set({});
        this.RtOnNotifyTags(resultTags);
    }

    public async RtAddSubscribe(topics: Array<string>) {
        // si todos los tags a agregar estan subscritos no invoco el comando 
        if (topics.findIndex(t => !this.NameTopics.has(t)) < 0) {
            return;
        }

        this.NameTopics = new Set(topics.concat(Array.from(this.NameTopics)))
        const topicsSet = Array.from(this.NameTopics);

        console.log("******** RtAddSubscribe topics", topicsSet);
        const resultTags = await this.call('rpc.rt.subscribe', topicsSet, this.timeout) as { tags: Array<TopicDto> };
        console.log("RtAddSubscribe resultTags", resultTags);

        this.RtOnNotifyTags(resultTags);
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

export {
    IsConnected,
    Topics
}
export default RtWs;
