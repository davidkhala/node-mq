
import Solace from 'solclientjs'

const {
    SolclientFactory,
    SessionEventCode,
    MessageDeliveryModeType
} = Solace.debug

export class TopicPublisher {
    constructor(logger) {
        this.logger = logger
        this.protocol = 'ws'
    }

    // Logger
    log(line) {
        const now = new Date();
        const time = [('0' + now.getHours()).slice(-2), ('0' + now.getMinutes()).slice(-2),
            ('0' + now.getSeconds()).slice(-2)];
        const timestamp = '[' + time.join(':') + '] ';
        this.logger.log(timestamp + line);
    }

    // Establishes connection to Solace PubSub+ Event Broker
    connect({host, username, vpn, password, port}) {
        if (this.session) {
            this.log('Already connected and ready to publish.');
            return;
        }
        // <protocol://host[:port]> <client-username>@<message-vpn> <client-password>
        // Available protocols are ws://, wss://, http://, https://, tcp://, tcps://

        const connectString = `${this.protocol}://${host}:${port}`

        this.log(`Connecting to Solace PubSub+ Event Broker using url: ${connectString}`);


        // create session

        this.session = SolclientFactory.createSession({
            url: connectString,
            vpnName: vpn,
            userName: username,
            password,
        });

        // define session event listeners
        this.session.on(SessionEventCode.UP_NOTICE, (sessionEvent) => {
            this.log('=== Successfully connected and ready to publish messages. ===');
            this.publish();
            this.disconnect();
        });
        this.session.on(SessionEventCode.CONNECT_FAILED_ERROR, (sessionEvent) => {
            this.log('Connection failed to the message router: ' + sessionEvent.infoStr +
                ' - check correct parameter values and connectivity!');
        });
        this.session.on(SessionEventCode.DISCONNECTED, (sessionEvent) => {
            this.log('Disconnected.');
            if (this.session !== null) {
                this.session.dispose();
                this.session = null;
            }
        });
        // connect the session

        this.session.connect();

    }

    publish(topicName, messageText) {


        const message = SolclientFactory.createMessage();
        message.setDestination(SolclientFactory.createTopicDestination(topicName));
        message.setBinaryAttachment(messageText);
        message.setDeliveryMode(MessageDeliveryModeType.DIRECT);
        this.log('Publishing message "' + messageText + '" to topic "' + topicName + '"...');

        this.session.send(message);
        this.log('Message published.');


    }

    disconnect() {

        this.session.disconnect();

    }
}
