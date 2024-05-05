const amqp = require('amqplib');

async function main() {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    const queue = 'payment_queue';

    await channel.assertQueue(queue, { durable: false });
    console.log("Payment Service Waiting for messages in %s", queue);
    channel.consume(queue, async (msg) => {
        const { student_no, term } = JSON.parse(msg.content.toString());
        // Your payment processing logic here
        console.log("Received payment request for student:", student_no, "for term:", term);
        // Simulate payment success
        // Send acknowledgment
        channel.sendToQueue(msg.properties.replyTo, Buffer.from(JSON.stringify({ status: 'success' })), { correlationId: msg.properties.correlationId });
        channel.ack(msg);
    });
}

main().catch(console.error);
