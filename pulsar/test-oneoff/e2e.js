import Pulsar from 'pulsar-client';

(async () => {
  // Create a client
  const client = new Pulsar.Client({
    serviceUrl: 'pulsar://localhost:6650'
  });

  // Create a producer
  const producer = await client.createProducer({
    topic: 'persistent://public/default/my-topic',
  });

  // Create a consumer
  const consumer = await client.subscribe({
    topic: 'persistent://public/default/my-topic',
    subscription: 'sub1'
  });

  // Send a message
  producer.send({
    data: Buffer.from("hello")
  });

  // Receive the message
  const msg = await consumer.receive();
  console.log(msg.getData().toString());
  consumer.acknowledge(msg);

  await producer.close();
  await consumer.close();
  await client.close();
})();