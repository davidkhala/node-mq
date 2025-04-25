import kafkajs from 'kafkajs';
import PubSub, {Admin as AbstractAdmin} from '@davidkhala/pubsub';

const {Admin, Kafka} = kafkajs;

export default class KafkaManager extends PubSub {

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

        this.kafkaManager = new Kafka({
            clientId,
            brokers,
            ssl,
            sasl
        });
    }

    get dba() {
        if (!this._admin) {
            this._admin = new KafkaAdmin(this.kafkaManager.admin());
        }
        return this._admin;
    }


    get producer() {
        return this.kafkaManager.producer();
    }

    get consumer() {
        return this.kafkaManager.consumer();
    }

}

export class KafkaAdmin extends AbstractAdmin {
    /**
     *
     * @param {Admin} admin
     */
    constructor(admin) {
        super();
        this.admin = admin;
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
