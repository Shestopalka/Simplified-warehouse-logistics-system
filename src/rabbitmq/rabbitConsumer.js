const amqp = require("amqplib");
const { query } = require('../db/dbPg.js');
const { handleError } = require("../errors/handleError.js");

async function startConsumer(queueName, callback) {
    
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();

    await channel.assertQueue(queueName, {durable: true});
    
    
    channel.consume(queueName, async (msg) => {
         if (msg !== null) {
            const data = JSON.parse(msg.content.toString());
            try {
                await callback(data);
                channel.ack(msg);
            } catch (err) {
                console.error(`❌ Error processing message in queue "${queueName}":`, err.message);

                const error = handleError(err)
                if(data?.orderId) {
                    console.log(error.message);
                    
                    await query("UPDATE orders SET status = $1 WHERE id = $2", [error.statusCode, data.orderId]);
                }
                channel.ack(msg); 
                }
        }
    });

    console.log(`🟢 Консюмер слухає: ${queueName}`);

}

module.exports = {startConsumer};