const {STOMP} = require('../index');
const brokerURL = 'ws://localhost:61614';
const conn = new STOMP({brokerURL});
const sleep = async (ms) => {
	return new Promise(resolve => setTimeout(resolve, ms));
};
const selfSendReceiveTask = async () => {
	const topic = 'a';
	await conn.connect();
	const listener = conn.subscribe(topic, ({body, headers}) => {
		console.log({body, headers});
		listener.unsubscribe();
	});
	await sleep(5000);
	conn.send(topic, 'b');
	await sleep(5000);
	conn.close();
};
selfSendReceiveTask();
