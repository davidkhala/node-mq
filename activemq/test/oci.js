import Stomp from 'stomp-client'

describe('raw tcp', function () {
    this.timeout(0)

    it('connect', async () => {

        const destination = '/queue/someQueueName';
        const user= 'oracleidentitycloudservice/david.yx.liu@oracle.com'
        const authToken = 'I3dvak45cE5IUEc3ZFF9UUIzSTY='
        const client = new Stomp('cell-1.queue.messaging.ap-singapore-1.oci.oraclecloud.com', 61613, user, '');

        client.tls= true
        client.connect((sessionId)=> {
            client.subscribe(destination, function(body, headers) {
              console.log('This is the body of a message on the subscribed queue:', body);
            });

            client.publish(destination, 'Oh herrow');
        });

    })

})