import {STOMPClient} from '../stomp.js'

describe('raw tcp', function () {
    this.timeout(0)

    it.skip('connect', async () => {

        const destination = '/queue/someQueueName';
        const user = 'oracleidentitycloudservice/david.yx.liu@oracle.com'
        const authToken = 'I3dvak45cE5IUEc3ZFF9UUIzSTY='
        const client = new STOMPClient('cell-1.queue.messaging.ap-singapore-1.oci.oraclecloud.com', user, authToken);

        await client.connect()


        await client.disconnect()

    })

})