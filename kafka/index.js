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
    }

    get admin() {
        if (!this._admin) {
            this._admin = this.kafkaManager.admin()
        }
        return this._admin
    }

    async connect() {
        await this.admin.connect()
    }

    async disconnect() {
        await this.admin.disconnect()
    }

    async listTopics() {
        return this.admin.listTopics()
    }

    producer() {
        return this.kafkaManager.producer()
    }


}
