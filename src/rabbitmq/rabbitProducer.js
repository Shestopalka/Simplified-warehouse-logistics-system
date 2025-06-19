
const amqp = require('amqplib');
const logger = require('../utils/logger');


async function sendToQueue(queueName, message) {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();

    await channel.assertQueue(queueName, {durable: true});
    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), {
        persistent: true,
    });
    logger.info("This name queue",queueName);
    
    logger.info('Message sent:', message);

    await channel.close();
    await connection.close();
    return "Message sent to queue";
    
    
}

module.exports = {sendToQueue};