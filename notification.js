const amqp = require('amqplib');

async function main() {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    const queue = 'notification_queue';

    await channel.assertQueue(queue, { durable: false });
    console.log("Notification Service Waiting for messages in %s", queue);
    channel.consume(queue, async (msg) => {
        const { student_no, term } = JSON.parse(msg.content.toString());
        // Your notification sending logic here
        console.log("Sending notification to student:", student_no, "for term:", term);
        // Send acknowledgment
        channel.ack(msg);
    });
}

main().catch(console.error);
