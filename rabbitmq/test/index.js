const {AMPQ} = require('../index');
const instance = new AMPQ({username: 'user', password: 'bitnami'});
const topic = 'tasks';
describe('rabbit MQ', () => {
    before(async () => {
        await instance.connect();
    })

    it('subscribe and send', async () => {
        const listener = async (message) => {
            if (message) {
                console.log(message.content.toString());
                instance.ack(message);
            }
        };
        await instance.subscribe(topic, listener);
        await instance.send(topic, 'b');
    })
    after(async () => {
        await instance.close()
    })
})
