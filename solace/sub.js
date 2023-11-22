import Solace from 'solclientjs';
import {SolaceConnect} from './index.js';

const {SessionEventCode, SolclientFactory, Message} = Solace;

export class Sub extends SolaceConnect {

	constructor(...props) {
		super(...props);
		this.timeout = 10000;
	}

	/**
	 *
	 * @param topicName
	 * @param {boolean} [waitUntil]
	 * @param {function} [onMessage]
	 * @returns {Promise<Message>}
	 */
	async subscribe(topicName, waitUntil, onMessage) {

		if (!onMessage) {
			onMessage = (message) => {
				const text = message.getBinaryAttachment().toString();
				this.logger.info(text);
				return text;
			};
		}
		const p1 = new Promise((resolve, reject) => {
			this.connection.subscribe(
				SolclientFactory.createTopicDestination(topicName),
				true, // generate confirmation when subscription is added successfully
				topicName, // use topic name as correlation key
				this.timeout
			);
			this.connection.on(SessionEventCode.SUBSCRIPTION_ERROR, (sessionEvent) => {
				reject(sessionEvent);
			});
			this.connection.on(SessionEventCode.SUBSCRIPTION_OK, (sessionEvent) => {
				resolve(sessionEvent);
			});
		});
		await p1;
		if (waitUntil) {
			return new Promise(resolve => {
				this.connection.on(SessionEventCode.MESSAGE, (message) => {
					resolve(onMessage(message));
				});
			});
		} else {
			this.connection.on(SessionEventCode.MESSAGE, onMessage);
		}


	}

	unsubscribe(topicName) {
		this.connection.unsubscribe(
			SolclientFactory.createTopicDestination(topicName),
			true, // generate confirmation when subscription is removed successfully
			topicName, // use topic name as correlation key
			this.timeout
		);
	}

}