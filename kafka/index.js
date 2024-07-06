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
	constructor(brokers, {ssl=true, clientId='kafkajs', sasl} = {}, logger) {
		super({
			name: clientId,
			username:sasl?sasl.username:undefined,
			password:sasl?sasl.password:undefined,
		}, undefined, logger);
		const config = {
			clientId,
			brokers,
			ssl,
			sasl
		};

		this.kafkaManager = new Kafka(config);
	}

	get admin() {
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

}
