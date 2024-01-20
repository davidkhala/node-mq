import DB, {Connectable} from '@davidkhala/db';

export default class MQ extends DB {
	constructor({domain, port, name, username, password, dialect, driver}, connectionString, logger) {
		super({domain, port, name, username, password, dialect, driver}, connectionString, logger);
	}

	/**
	 * @abstract
	 * @return {Pub}
	 */
	get producer() {
		return new Pub()
	}

	/**
	 * @abstract
	 * @return {Sub}
	 */
	get consumer() {
		return new Sub()
	}

	/**
	 * @abstract
	 * @return {Admin}
	 */
	get admin() {
		return new Admin()
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

	/**
	 * Truncate data
	 * @abstract
	 */
	async clear() {

	}
}