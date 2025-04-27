import PulsarClient from 'pulsar-client';
import PubSub, {Pub, Sub} from '@davidkhala/pubsub';
import {hostname} from '@davidkhala/light/devOps.js';

const {Client, MessageId} = PulsarClient;

export default class Pulsar extends PubSub {
    constructor({domain, port = 6650}) {
        super();
        this.domain = domain
        this.port = port
        this.connection = new Client({
            serviceUrl: this.serviceUrl
        });

    }

    get serviceUrl() {
        // connectionString alike
        const dialect = 'pulsar'
        const {domain, port} = this;
        return `${dialect}://${domain}:${port}`;
    }

    set mTLS(bool) {
        if (bool) {
            this.driver = 'ssl';
            this.connection = new Client({
                serviceUrl: this.connectionString
            });
        } else {
            delete this.driver;
        }
    }


    async disconnect() {
        await this.connection.close();
    }


    /**
     *
     * @param topic
     * @returns {Producer}
     */
    getProducer(topic) {
        return new Producer(this.connection, {topic});
    }

    /**
     *
     * @param topic
     * @param [group]
     * @returns {Consumer}
     */
    getConsumer(topic, group) {
        if (!group) {
            group = `${hostname}:${process.pid}`;
        }
        return new Consumer(this.connection, {topic, group})

    }
}

export class Producer extends Pub {
    constructor(pulsar, options) {
        const {topic} = options
        super(pulsar, {topic});
        this.pulsar = pulsar
    }

    async connect() {
        const {topic, pulsar} = this
        this.pub = await pulsar.createProducer({topic})
    }

    async send(message) {
        return await this.pub.send({data: Buffer.from(message)});
    }

    async disconnect() {
        await this.pub.close();
    }
}

export class Consumer extends Sub {

    constructor(pulsar, options) {
        const {topic, group} = options
        super(pulsar, {topic, group});
        this.pulsar = pulsar;
    }

    async connect() {
        const {topic, pulsar, group} = this
        this.sub = await pulsar.subscribe({
            topic,
            subscription: group
        });

    }

    async subscribe() {
        const msg = await this.sub.receive();
        return {
            data: msg.getData().toString(),
            id: msg.getMessageId().serialize()
        };
    }

    async acknowledge(message) {
        return await this.sub.acknowledgeId(MessageId.deserialize(Buffer.from(message)));
    }

    async disconnect() {
        return await this.sub.close();
    }
}