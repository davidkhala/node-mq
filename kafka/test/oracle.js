const KafkaManager = require('../index')
const assert = require('assert')

describe('Oracle Streaming', function () {
    this.timeout(30000)

    const kafka_brokers_sasl = ['cell-1.streaming.us-ashburn-1.oci.oraclecloud.com:9092']
    const {username} = process.env
    // The AuthToken is managed in OCI User console, not OCI IDCS password
    const password = process.env.authToken

    if (!password) {
        throw Error('Missing password')
    }

    it('connect', async () => {
        const client = new KafkaManager(kafka_brokers_sasl, {username, password})

        await client.connect()
        const result = await client.listTopics()
        assert.strictEqual(result[0], 'kafka')
        await client.disconnect()
    })
})