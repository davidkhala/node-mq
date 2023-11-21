import Solace from 'solclientjs';
import {SolaceConnect} from './index.js';

const {SessionEventCode, SolclientFactory} = Solace;

export class Sub extends SolaceConnect {
	async subscribe(topicName) {
		this.connection.on(SessionEventCode.MESSAGE, (message) => {

			console.info('Received message: "' + message.getBinaryAttachment() + '", details:\n' +
				message.dump());
			console.info(message.dump());
		});


		this.connection.subscribe(
			SolclientFactory.createTopicDestination(topicName),
			true, // generate confirmation when subscription is added successfully
			topicName, // use topic name as correlation key
			10000 // 10 seconds timeout for this operation
		);
		this.connection.on(SessionEventCode.SUBSCRIPTION_ERROR, (sessionEvent) => {
			console.error(sessionEvent);
		});
		this.connection.on(SessionEventCode.SUBSCRIPTION_OK, (sessionEvent) => {
			console.info(sessionEvent);

		});


	}

	unsubscribe(topicName) {
		this.connection.unsubscribe(
			SolclientFactory.createTopicDestination(topicName),
			true, // generate confirmation when subscription is removed successfully
			topicName, // use topic name as correlation key
			10000 // 10 seconds timeout for this operation
		);
	}

}