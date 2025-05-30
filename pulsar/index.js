import PulsarClient from 'pulsar-client';
import PubSub from '@davidkhala/pubsub';
import {hostname} from '@davidkhala/light/devOps.js';
import {Producer} from "./pub.js";
import {Consumer, Reader} from './sub.js'

const {Client} = PulsarClient

export default class Pulsar extends PubSub {
    constructor({domain, port = 6650, topic}) {
        super();
        this.domain = domain
        this.port = port
        this.connection = new Client({
            serviceUrl: this.serviceUrl
        });
        this.topic = topic;

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
     * @returns {Producer}
     */
    getProducer(topic = this.topic) {
        return new Producer(this.connection, {topic});
    }

    /**
     *
     * @returns {Consumer}
     */
    getConsumer(topic = this.topic, group) {
        if (!group) {
            group = `${hostname}:${process.pid}`;
        }
        return new Consumer(this.connection, {topic, group})
    }

    /**
     *
     * @returns {Promise<string[]>}
     */
    async partitions(topic = this.topic) {
        return await this.connection.getPartitionsForTopic(topic)
    }

    getReader(topic = this.topic) {
        return new Reader(this.connection, {topic})
    }
}
