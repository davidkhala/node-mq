import kafkajs from 'kafkajs';
import PubSub, {Admin as AbstractAdmin} from '@davidkhala/pubsub';
const {Admin, Kafka} = kafkajs;

export default class KafkaManager extends PubSub {

	/**
	 *
	 * @param {string[]} brokers
	 * @param {string} [username]
	 * @param {string} [password]
	 * @param {string} [clientId] default to "kafkajs"
	 * @param logger
	 */
	constructor(brokers, {username, password, clientId} = {}, logger) {
		super({name: clientId, username, password}, undefined, logger);
		const config = {
			clientId,
			brokers,
		};
		if (username) {
			Object.assign(config, {
				ssl: true,
				sasl: {
					mechanism: 'plain', // scram-sha-256 or scram-sha-512
					username,
					password
				},
			});
		}
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
