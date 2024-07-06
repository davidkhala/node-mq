import KafkaManager from './index.js';

export default class Insecure extends KafkaManager {
	constructor(brokers) {
		super(brokers, {ssl: false});
	}
}