import {Kafka} from 'kafkajs'


export default class KafkaManager {

    /**
     *
     * @param {string[]} brokers
     * @param {string} [username]
     * @param {string} [password]
     * @param {string} [clientId] default to "kafkajs"
     */
    constructor(brokers, {username, password, clientId} = {}) {
        const config = {
            clientId,
            brokers,
        }
        if (username) {
            Object.assign(config, {
                ssl: true,
                sasl: {
                    mechanism: 'plain', // scram-sha-256 or scram-sha-512
                    username,
                    password
                },
            })
        }
        this.kafkaManager = new Kafka(config)
        this._admin = this.admin();
    }

    admin() {
        return this.kafkaManager.admin()
    }

    async connect() {
        await this._admin.connect()
    }

    async disconnect() {
        await this._admin.disconnect()
    }

    async listTopics() {
        return this._admin.listTopics()
    }

    producer() {
        return kafka.producer()
    }


}
