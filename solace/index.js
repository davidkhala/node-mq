import DB from '@davidkhala/db'
import Solace from 'solclientjs'

const {    SolclientFactory,    SessionEventCode} = Solace.debug
export class SolaceConnect extends DB{
    constructor({domain = 'localhost',username, password, vpn}, logger) {
        super({dialect:'ws',domain, port:8008, username, password}, undefined,logger );
        this.vpn= vpn
    }

    async _connect() {
        // Establishes connection to Solace PubSub+ Event Broker

            if (this.connection) {
                this.logger.info('Already connected and ready to publish.');
                return true;
            }
        // <protocol://host[:port]> <client-username>@<message-vpn> <client-password>
        // Available protocols are ws://, wss://, http://, https://, tcp://, tcps://
        const connectString = `${this.dialect}://${this.domain}:${this.port}`

        this.logger.debug(`Connecting to Solace PubSub+ Event Broker using url: ${connectString}`);
        // create session
        this.connection = SolclientFactory.createSession({
            url: connectString,
            vpnName: this.vpn,
            userName: this.username,
            password:this.password,
        });
            return new Promise((resolve, reject) => {

                // define session event listeners
                this.connection.on(SessionEventCode.UP_NOTICE, (sessionEvent) => {
                    this.log('=== Successfully connected and ready to publish messages. ===');
                    resolve(sessionEvent)

                });
                this.connection.on(SessionEventCode.CONNECT_FAILED_ERROR, (sessionEvent) => {
                    reject(sessionEvent)

                });
                this.connection.on(SessionEventCode.DISCONNECTED, (sessionEvent) => {
                    this.log('Disconnected.');
                    if (this.connection) {
                        this.connection.dispose(); // TODO check impact since .dispose is a deprecated function
                        delete this.connection ;
                    }
                });
                // connect the session

                this.connection.connect();

            })

    }

    async _ignoreConnectError(e) {
        return Promise.resolve(false);
    }

    get dba() {
        return undefined;
    }

    async disconnect() {
        this.connection.disconnect();
    }

    async query(template, values, requestOptions) {
        return Promise.resolve(undefined);
    }
}
