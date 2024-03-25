import {AMPQ} from './index.js';

export default class CloudAMQP extends AMPQ {
	constructor({domain, tls, password, username}, connectionString, logger) {

		const port = tls ? 5671 : 5672;
		const dialect = tls ? 'amqps' : 'amqp';
		super({domain, port, password, username, dialect}, connectionString, logger);
	}
}