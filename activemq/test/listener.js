const {STOMP} = require('../index');
const brokerURL = 'ws://localhost:61614';
const conn = new STOMP({brokerURL});
const task = async () => {
	const topic = 'a';
	await conn.connect();
	const listener = conn.subscribe(topic, ({body, headers}) => {
		console.log({body, headers});
		listener.unsubscribe();
		conn.close();
	});

};
task();
