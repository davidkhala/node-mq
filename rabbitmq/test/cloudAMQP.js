import CloudAMQP from '../cloudAMQP.js';

const domain = process.env.DOMAIN;
const username = process.env.USER;
const password = process.env.PASSWORD;
describe('rabbitmq:Little Lemur:AP-NorthEast-1', function () {
    this.timeout(0);

    it('plain connect', async () => {
        const plain = new CloudAMQP({domain, username, password});
        await plain.connect();
        await plain.disconnect();
    })

    it('tls', async () => {
        const tlsClient = new CloudAMQP({domain, username, password, tls: true});
        await tlsClient.connect();
        await tlsClient.disconnect();
        await tlsClient.connect();
        await tlsClient.disconnect();
    });

});