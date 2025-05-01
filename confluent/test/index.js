import Confluent from '../index.js'
import * as assert from "node:assert";

describe('', function () {
    this.timeout(0)
    const endpoint = process.env.ENDPOINT
    const apiKey = process.env.API_KEY
    const apiSecret = process.env.API_SECRET
    const topic = "topic";
    const key = `${Date.now()}`;
    const value = "value";
    const confluent = new Confluent({
        endpoint, apiKey, apiSecret
    })
    it('create topic', async () => {
        const admin = confluent.getAdmin()
        await admin.connect()
        await admin.createTopics(topic)
        await admin.disconnect()
    })
    it('pubsub', async () => {


        const pub = confluent.getProducer({topic})
        await pub.connect()
        await pub.send({key, value})

        const sub = confluent.getConsumer({topic})
        await sub.connect()
        const gotValue = await new Promise((resolve, reject) => {
            sub.subscribe(({topic, partition, message}) => {
                const _key = message.key.toString()
                if (key === _key) {
                    resolve(message.value)
                }

            })
        })
        assert.equal(gotValue.toString(), value)

        await sub.disconnect()
        await pub.disconnect()


    })
});