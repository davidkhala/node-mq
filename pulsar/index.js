// import {Client} from 'pulsar-client';
import PulsarClient from 'pulsar-client';
import PubSub from '@davidkhala/pubsub';
import {hostname} from '@davidkhala/light/devOps.js';
import {Producer} from "./pub.js";
import {Consumer, Reader} from './sub.js'
const {Client} = PulsarClient

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
     * @param {string} topic
     * @param [group]
     * @returns {Consumer}
     */
    getConsumer(topic, group) {
        if (!group) {
            group = `${hostname}:${process.pid}`;
        }
        return new Consumer(this.connection, {topic, group})

    }

    getReader(){
        return new Reader(this.connection, {topic})
    }
}
