import {Kafka as NativeKafka} from 'kafkajs';
import PubSub, {Admin as AbstractAdmin, Sub as AbstractSub, Pub as AbstractPub} from '@davidkhala/pubsub';


export default class Kafka extends PubSub {

    /**
     *
     * @param {string[]} brokers
     * @param [ssl] default to true
     * @param {string} [clientId] default to "kafkajs"
     * @param sasl sasl config
     * @param [logger]
     */
    constructor(brokers, {ssl = true, clientId = 'kafkajs', sasl} = {}) {
        super();
        this.name = clientId
        if (sasl) {
            const {username, password} = sasl
            this.username = username
            this.password = password
        }

        this.kafka = new NativeKafka({
            clientId,
            brokers,
            ssl,
            sasl
        });
    }

    getAdmin(options) {
        return new Admin(this.kafka, options);
    }


    getProducer(topic) {
        return new Pub(this.kafka, {topic});
    }

    getConsumer(topic, groupId) {
        return new Sub(this.kafka, {groupId, topic});
    }

}

export class Sub extends AbstractSub {
    constructor(kafka, options) {
        const {groupId, topic} = options
        super(kafka, {group: groupId, topic});
        this.sub = kafka.consumer(options)
        this.fromBeginning = true
    }

    async connect(...topics) {
        await this.sub.connect()
    }

    async disconnect() {
        await this.sub.disconnect()
    }


    async subscribe(...topics) {
        const {fromBeginning} = this
        await this.sub.subscribe({
            topics: [this.topic, ...topics],
            fromBeginning
        })
    }

    /**
     * @param {function({topic, partition, message})} onMessage callback
     */
    async run(onMessage){
        await this.sub.run({
            eachMessage: onMessage
        })
    }
}

export class Pub extends AbstractPub {
    constructor(kafka, options) {
        const {topic} = options
        super(kafka, {topic});
        this.pub = kafka.producer(options);
    }

    async send(...message) {
        return await this.pub.send({
            topic: this.topic,
            messages: message
        })
    }

    async connect() {
        await this.pub.connect()
    }

    async disconnect() {
        await this.pub.disconnect()
    }
}

export class Admin extends AbstractAdmin {
    constructor(kafka, options) {
        super();
        this.admin = kafka.admin(options);
    }

    async listTopics() {
        return this.admin.listTopics();
    }

    async _connect() {
        await this.admin.connect();
        return true;
    }

    async disconnect() {
        await this.admin.disconnect();
    }

    async clear() {
        const topics = await this.listTopics()

        await this.admin.deleteTopics({topics})
    }
}
