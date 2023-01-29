import {WebsocketClient} from '../websocketClient.js';
import {STOMPClient} from '../stomp.js'
import {sleep} from '@davidkhala/light/index.js'

describe('STOMP', function () {
    this.timeout(0)
    it('connect', async () => {
        const host = 'localhost';
        const client = new STOMPClient(host)
        await client.connect()

        client.send('a', 'b')
        await client.disconnect()
    })

})

describe('websocket', function () {
    this.timeout(0)
    const host = 'localhost';
    const conn = new WebsocketClient(host);

    it('selfSendReceive', async () => {
        await conn.connect()

        conn.send('a', 'b')
        await conn.disconnect()
        // const listener = conn.subscribe(topic, async ({body, headers}) => {
        //     console.log({body, headers});
        //     listener.unsubscribe();
        //     await conn.close();
        // });

        // conn.send(topic, 'b');
        // await sleep(5000);

    })
})

