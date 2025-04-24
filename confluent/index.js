const {
    Kafka,
    ErrorCodes, CompressionTypes, 
  } = require('@confluentinc/kafka-javascript').KafkaJS;


  const producer = new Kafka().producer({
    'bootstrap.servers': '<fill>',
});

await producer.connect();

const deliveryReports = await producer.send({
    topic: 'test-topic',
    messages: [
      { value: 'v1', key: 'x' },
    ]
});

console.log({deliveryReports});
await producer.disconnect();