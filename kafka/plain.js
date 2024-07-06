import KafkaManager from './index.js';

export default class PlainSASL extends KafkaManager {
	/**
	 *
	 * @param brokers
	 * @param username
	 * @param password
	 * @param [logger]
	 */
	constructor(brokers, {username, password}, logger) {
		super(brokers, {
			sasl: {
				mechanism: 'plain',
				username,
				password
			}
		}, logger);
	}
}