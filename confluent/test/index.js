import Confluent from '../index.js'
import * as assert from "node:assert";

describe('', function () {
    this.timeout(0)
    const topic = "sample_data_stock_trades";
    const key = `${Date.now()}`;
    const value = "value";
    it('produce', async () => {
        const endpoint = process.env.ENDPOINT
        const apiKey = process.env.API_KEY
        const apiSecret = process.env.API_SECRET

        const confluent = new Confluent({
            endpoint, apiKey, apiSecret
        })

        const pub = confluent.getProducer({topic})
        await pub.connect()
        await pub.send({key, value})

        const sub = confluent.getConsumer({topic})
        await sub.connect()
        const gotValue = await new Promise((resolve, reject) => {
            sub.subscribe(async ({topic, partition, message}) => {
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