import {STOMP} from '../stomp.js';
import {sleep} from '@davidkhala/light/index.js'

describe('localhost', function () {
    this.timeout(0)
    const brokerURL = 'ws://localhost:61614';
    const conn = new STOMP(brokerURL);

    it('selfSendReceive', async () => {
        const topic = 'a';

        await conn.connect()
        conn.send(topic, 'b')

        // const listener = conn.subscribe(topic, async ({body, headers}) => {
        //     console.log({body, headers});
        //     listener.unsubscribe();
        //     await conn.close();
        // });
        // await sleep(5000);
        // conn.send(topic, 'b');
        // await sleep(5000);

    })
})

