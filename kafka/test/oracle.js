import KafkaManager from '../index.js'
import assert from 'assert'

describe('Oracle Streaming', function () {
    this.timeout(0)



    const kafka_brokers_sasl = ['cell-1.streaming.ap-singapore-1.oci.oraclecloud.com:9092']
    // Your username must be in the format: tenancyName/domain/username/streamPool-ocid
    const username = 'davidkhala2021/OracleIdentityCloudService/davidkhala@gmail.com/ocid1.streampool.oc1.ap-singapore-1.amaaaaaaulaazmqarbifzdl6n6ml2nfjykqbvawf6fnfwnistfwdvz32aqda'
    // https://docs.oracle.com/en-us/iaas/Content/Streaming/Tasks/kafkacompatibility_topic-Configuration.htm#configuration
    // The AuthToken is managed in OCI User console, not OCI IDCS password
    const password = process.env.authToken

    if (!password) {
        throw Error('Missing password')
    }

    it('connect', async () => {
        const client = new KafkaManager(kafka_brokers_sasl, {username, password})
        const {admin} = client
        await admin.connect()
        const topics = await admin.listTopics()

        assert.ok(topics.includes('streaming'))
        await admin.disconnect()
    })
})