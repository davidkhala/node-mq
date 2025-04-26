import Kafka from './index.js';

export default class Insecure extends Kafka {
	constructor(...brokers) {
		super(brokers, {ssl: false});
	}
}