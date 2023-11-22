import DB from '@davidkhala/db';
import Solace from 'solclientjs';

const {
	SolclientFactoryProperties,
	SolclientFactoryProfiles,
	SolclientFactory,
	SessionEventCode,
} = Solace;

export class SolaceConnect extends DB {
	/**
	 *
	 * @param domain
	 * @param username
	 * @param password
	 * @param {string} vpn Solace Message VPN
	 * @param logger
	 */
	constructor({domain = 'localhost', username, password, vpn}, logger) {
		super({dialect: 'ws', domain, port: 8008, username, password}, undefined, logger);
		this.vpn = vpn;
		// Initialize factory with the most recent API defaults
		const factoryProps = new SolclientFactoryProperties();
		factoryProps.profile = SolclientFactoryProfiles.version10_5;
		SolclientFactory.init(factoryProps);
		this.SolclientFactory = SolclientFactory;
	}

	async _connect() {
		const {SolclientFactory, password} = this;

		// Establishes connection to Solace PubSub+ Event Broker
		if (this.connection) {
			this.logger.info('Already connected');
			return true;
		}
		// <protocol://host[:port]> <client-username>@<message-vpn> <client-password>
		// Available protocols are ws://, wss://, http://, https://, tcp://, tcps://
		const connectString = `${this.dialect}://${this.domain}:${this.port}`;

		this.logger.debug(`Connecting to Solace PubSub+ Event Broker using url=${connectString}, vpn=${this.vpn}`);
		// create session
		this.connection = SolclientFactory.createSession({
			url: connectString,
			vpnName: this.vpn,
			userName: this.username,
			password,
		});

		return new Promise((resolve, reject) => {

			// define session event listeners
			this.connection.on(SessionEventCode.UP_NOTICE, (sessionEvent) => {
				resolve(sessionEvent);

			});
			this.connection.on(SessionEventCode.CONNECT_FAILED_ERROR, (sessionEvent) => {
				reject(sessionEvent);

			});

			// connect the session
			this.connection.connect();

		});

	}


	get dba() {
		return undefined;
	}

	async disconnect() {
		if (this.connection) {
			this.connection.disconnect();
			this.connection.dispose(); // TODO check impact since .dispose is a deprecated function
			delete this.connection;
		}

	}

	async query(template, values, requestOptions) {
		return Promise.resolve(undefined);
	}

	_throwConnectError(e) {
		return undefined;
	}
}
