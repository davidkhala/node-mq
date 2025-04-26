import Kafka from './index.js';

export default class PlainSASL extends Kafka {
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