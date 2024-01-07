import DB from '@davidkhala/db';

export default class MQ extends DB {
	/**
     *
     * @param {string} topic
     * @param {string} message
     * @param [options]
	 * @abstract
     */
	async send(topic, message, ...options) {

	}

	/**
     *
     * @param {string} topic
     * @param [options]
	 * @abstract
     */
	async subscribe(topic, ...options) {

	}

	/**
     *
     * @param {string} message
	 * @abstract
     */
	async acknowledge(message) {

	}

}