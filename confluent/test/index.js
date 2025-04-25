import Confluent from '../index.js'

describe('', function () {
    this.timeout(0)
    const topic = "sample_data_stock_trades";
    const key = "key";
    const value = "value";
    it('produce', async () => {
        const endpoint = 'pkc-5m9gg.eastasia.azure.confluent.cloud:9092'
        const apiKey = '4DUMSQELO5WSKSAY'
        const apiSecret = process.env.API_SECRET

        const confluent = new Confluent({
            endpoint, apiKey, apiSecret
        })

        const pub = confluent.getProducer({topic})
        await pub.connect()
        await pub.send({key, value})

        const sub = confluent.getConsumer({topic})
        await sub.connect()
        await sub.subscribe(async ({topic, partition, message}) => {
            console.log({
                topic, partition, key: message.key.toString(), value: JSON.parse(message.value)
            });
        })
        process.on("SIGTERM", ()=>{sub.disconnect()});
        process.on("SIGINT", ()=>{sub.disconnect()});

    })
});