import KafkaManager from '../index.js'

import assert from 'assert'
const kafka_brokers_sasl = [
    "broker-3-gry0n7cv2tblgg8t.kafka.svc08.us-south.eventstreams.cloud.ibm.com:9093",
    "broker-4-gry0n7cv2tblgg8t.kafka.svc08.us-south.eventstreams.cloud.ibm.com:9093",
    "broker-5-gry0n7cv2tblgg8t.kafka.svc08.us-south.eventstreams.cloud.ibm.com:9093",
    "broker-0-gry0n7cv2tblgg8t.kafka.svc08.us-south.eventstreams.cloud.ibm.com:9093",
    "broker-2-gry0n7cv2tblgg8t.kafka.svc08.us-south.eventstreams.cloud.ibm.com:9093",
    "broker-1-gry0n7cv2tblgg8t.kafka.svc08.us-south.eventstreams.cloud.ibm.com:9093"
]
const username = 'token'
const topic = 'davidkhala-node-mq'
describe('IBM Event Stream', function () {
    this.timeout(0)
    const {api_key} = process.env
    if (!api_key) {
        throw Error('Missing api_key')
    }
    it('connect', async () => {
        const client = new KafkaManager(kafka_brokers_sasl, {username, password: api_key})

        await client.connect()
        const result = await client.listTopics()
        assert.strictEqual(result[0], topic)
        await client.disconnect()
    })
})
