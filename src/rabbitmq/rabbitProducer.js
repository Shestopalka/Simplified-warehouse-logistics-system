
const amqp = require('amqplib');


async function sendToQueue(queueName, message) {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();

    await channel.assertQueue(queueName, {durable: true});
    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), {
        persistent: true,
    });
    console.log("This name queue",queueName);
    
    console.log('Message sent:', message);

    await channel.close();
    await connection.close();
    return "Message sent to queue";
    
    
}

module.exports = {sendToQueue};