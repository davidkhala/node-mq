import {SolaceConnect} from './index.js';
import Solace from 'solclientjs';

const {MessageDeliveryModeType} = Solace;

export class Pub extends SolaceConnect {

	publish(topicName, messageText) {

		const {factory} = this;
		const message = factory.createMessage();
		message.setDestination(factory.createTopicDestination(topicName));
		message.setBinaryAttachment(messageText);
		message.setDeliveryMode(MessageDeliveryModeType.PERSISTENT);
		this.logger.debug('Publishing message "' + messageText + '" to topic "' + topicName + '"...');

		this.connection.send(message);
	}

	_throwConnectError(e) {
		return true;
	}

}
