const {STOMP} = require('../index');
const brokerURL = 'ws://localhost:61614';
const conn = new STOMP({brokerURL});
const task = async () => {
	const topic = 'a';
	await conn.connect();
	conn.send(topic, 'b');
	conn.close();
};
task();
