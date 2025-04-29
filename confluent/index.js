import {KafkaJS} from '@confluentinc/kafka-javascript'
import MQ, {Pub as AbstractPub, Sub as AbstractSub} from '@davidkhala/pubsub'
import crypto from 'crypto'
import * as assert from "node:assert";

const {Kafka} = KafkaJS


export default class Confluent extends MQ {
    constructor({endpoint, id, apiKey, apiSecret}) {
        super()
        this.connection = new Kafka({
            'bootstrap.servers': endpoint,
            'security.protocol': 'SASL_SSL',
            'sasl.mechanisms': 'PLAIN',
            "client.id": id || `ccloud-nodejs-client-${crypto.randomUUID()}`,
            'sasl.username': apiKey,
            'sasl.password': apiSecret,
        })
    }

    /**
     *
     * @param options
     * @returns {Pub}
     */
    getProducer(options) {
        /**
         * Delay in milliseconds to wait for messages in the producer queue to accumulate before constructing message batches to transmit to brokers.
         * A higher value means less overhead, improved compression of messages, at the expense of increased message delivery latency.
         * @type number
         */
        options["linger.ms"] = options["linger.ms"] || 5
        return new Pub(this.connection, options)
    }


    /**
     *
     * @param options
     * @returns {Sub}
     */
    getConsumer(options) {
        return new Sub(this.connection, options);
    }
}

export class Pub extends AbstractPub {
    constructor(kafka, options) {
        super(kafka, options);
        this.pub = kafka.producer(options);
    }

    async connect() {
        await this.pub.connect();
    }

    async send(...messages) {
        return await this.pub.send({
            topic: this.topic, messages
        })
    }

    send_async(...messages) {
        this.pub.send({
            topic: this.topic,
            messages
        });
    }

    /**
     * call flush to send all messages in the internal buffer without waiting for the linger.ms to expire.
     * @param timeout
     * @returns {Promise<void>}
     */
    async flush(timeout) {
        await this.pub.flush({timeout});
    }

    async disconnect() {
        await this.pub.disconnect();
    }
}

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

