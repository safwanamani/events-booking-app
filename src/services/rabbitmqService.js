const amqp = require("amqplib");
const { rabbitmq } = require("../../config");

let channel;

async function connectRabbitMQ() {
  const connection = await amqp.connect(rabbitmq.url);
  channel = await connection.createChannel();

  await channel.assertQueue("email_notifications");
}

async function sendToQueue(message) {
  if (!channel) await connectRabbitMQ();
  channel.sendToQueue(
    "email_notifications",
    Buffer.from(JSON.stringify(message))
  );
}

module.exports = { sendToQueue };
