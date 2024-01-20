import DB, {Connectable} from '@davidkhala/db';

export default class MQ extends DB {
	constructor({domain, port, name, username, password, dialect, driver}, connectionString, logger) {
		super({domain, port, name, username, password, dialect, driver}, connectionString, logger);
	}

	/**
	 * @abstract
	 * @return {Promise<Pub>|Pub}
	 */
	get producer() {

	}

	/**
	 * @abstract
	 * @return {Promise<Sub>|Sub}
	 */
	get consumer() {

	}

	/**
	 * @abstract
	 * @return {Promise<Admin>|Admin}
	 */
	get admin() {

	}

}

export class Pub extends Connectable {
	/**
	 *
	 * @abstract
	 * @param {string} topic
	 * @param {string} message
	 * @param [options]
	 */
	async send(topic, message, ...options) {

	}

}

export class Sub extends Connectable {
	/**
	 *
	 * @abstract
	 * @param {string} topic
	 * @param [options]
	 */
	async subscribe(topic, ...options) {

	}

	/**
	 *
	 * @abstract
	 * @param {string} message
	 */
	async acknowledge(message) {

	}

}

export class Admin extends Connectable {
	/**
	 * @abstract
	 */
	async listTopics() {

	}
}