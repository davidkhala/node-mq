import assert from 'assert';
import Insecure from '../insecure.js';
import KafkaController from '../test-utils/testcontainers.js'

describe('testcontainers', function () {
    this.timeout(0);
    let controller
    before(async () => {
        controller = new KafkaController()
        await controller.start()
    })
    it('connect', async () => {
        const client = new Insecure(controller.broker);
        const admin = client.getAdmin();
        await admin.connect();
        const topics = await admin.listTopics();

        assert.ok(topics.length === 0);
        await admin.disconnect();
    })
    it('pubsub', async () => {
        const client = new Insecure(controller.broker);
        const topic = "test-topic"
        const value = "test message"
        const pub = client.getProducer(topic)
        await pub.connect()
        let sendReceipt = await pub.send({value})
        console.debug({sendReceipt})

        const sub = client.getConsumer(topic, 'test-group')
        await sub.connect()
        await sub.subscribe()
        await new Promise((resolve, reject) => {
            sub.run(async ({message}) => {
                const gotValue = message.value.toString()
                if (gotValue === value) {
                    resolve()
                }
            })
        })
        await sub.disconnect()
        await pub.disconnect()


    })
    after(async () => {
        await controller.stop()
    })

});