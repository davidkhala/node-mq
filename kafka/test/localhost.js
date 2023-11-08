import KafkaManager from '../index.js'
import assert from 'assert'

describe('docker', function () {
    this.timeout(0)
    it('connect', async () => {
        const kafka_brokers_sasl = ['kafka1:9092',
            'kafka2:9092','kafka3:9092']
        const client = new KafkaManager(kafka_brokers_sasl)

        await client.connect()
        const topics = await client.listTopics()

        assert.ok(topics.includes('streaming'))
        await client.disconnect()
    })
})