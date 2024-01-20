import {STOMPClient} from '../stomp.js'

describe('raw tcp', function () {
    this.timeout(0)

    it('connect', async () => {

        const destination = '/queue/someQueueName';
        const user = 'oracleidentitycloudservice/davidkhala@gmail.com'
        const authToken = '59txmZocDuf1Dms_0R{j'
        const client = new STOMPClient('cell-1.queue.messaging.ap-singapore-1.oci.oraclecloud.com', user, authToken);

        await client.connect()


        await client.disconnect()

    })

})