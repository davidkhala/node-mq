import {KafkaJS} from '@confluentinc/kafka-javascript'
import MQ, {Admin as AbstractAdmin} from '@davidkhala/pubsub'
import crypto from 'crypto'
import {Sub} from "./sub.js";
import {Pub} from "./pub.js";

const {Kafka, Admin: NativeAdmin} = KafkaJS


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

    getAdmin(options) {
        return new Admin(this.connection, options);
    }
}

export class Admin extends AbstractAdmin {
    constructor(kafka, options) {
        super();
        /**
         * @type NativeAdmin
         */
        this.admin = kafka.admin(options);
    }

    async connect() {
        await this.admin.connect()
    }

    async listTopics() {
        return await this.admin.listTopics()
    }

    async deleteTopics(...topics) {
        await this.admin.deleteTopics({topics})
    }

    /**
     *
     * @param {string} topics
     */
    async createTopics(...topics) {
        await this.admin.createTopics({
            topics: topics.map(topic => ({
                topic
            }))
        })
    }

    async disconnect() {
        await this.admin.disconnect()
    }

    async clear() {
        const topics = await this.listTopics()
        await this.deleteTopics(...topics)
    }
}
