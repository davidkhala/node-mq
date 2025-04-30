import {Sub as AbstractSub} from "@davidkhala/pubsub";
import assert from "node:assert";

export class Sub extends AbstractSub {

    static _setOption(options, alias, key, defaultValue) {
        if (options[alias]) {
            options[key] = options[alias];
            delete options[alias];
        } else {
            options[key] = defaultValue;
        }
    }

    constructor(kafka, options) {
        Sub._setOption(options, 'timeout', 'session.timeout.ms', 45000) // Best practice for higher availability in librdkafka clients prior to 1.7
        options["auto.offset.reset"] = "earliest"
        const {group, topic} = options
        if (!group) {
            options.group = 'nodejs-group'
        }
        assert.ok(topic)
        super(kafka, {topic, group});
        delete options.topic
        delete options.group
        this.sub = kafka.consumer(Object.assign(options, {
            "group.id": this.group
        }))
    }

    async connect() {
        await this.sub.connect();
    }

    async disconnect() {
        await this.sub.commitOffsets();
        await this.sub.disconnect();
    }

    /**
     * Kafka consumers automatically acknowledge message(equivalent to commit offsets) processing upon broker acquisition
     * By default, offsets are committed automatically by the library.
     * To commit offsets manually, setting `enable.auto.commit` to false
     */
    async acknowledge() {
        await this.sub.commitOffsets()
    }

    /**
     *
     * @param {function({topic, partition, message})} onMessage
     * @param topic
     */
    async subscribe(onMessage, ...topic) {
        await this.sub.subscribe({topics: [this.topic, ...topic]});
        await this.sub.run({
            eachMessage: onMessage
        })
    }
}