import {Websocket} from '../websocket.js';
import {sleep} from '@davidkhala/light/index.js'

describe('localhost', function () {
    this.timeout(0)
    const brokerURL = 'ws://localhost:61614';
    const conn = new Websocket(brokerURL);

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

