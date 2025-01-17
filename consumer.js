const amqp = require("amqplib");
const { rabbitmq } = require("./config");

async function consumeMessages() {
  const connection = await amqp.connect(rabbitmq.url);
  const channel = await connection.createChannel();
  await channel.assertQueue("email_notifications");

  channel.consume("email_notifications", (msg) => {
    if (msg) {
      const queueData = JSON.parse(msg.content);
      console.log(
        `Email notification: Thank you, ${queueData.userName}! You’ve successfully booked your spot for ${queueData.eventName}. Get ready for an amazing experience!`
      );
      channel.ack(msg);
    }
  });
}

consumeMessages().catch((error) => console.error(error));
