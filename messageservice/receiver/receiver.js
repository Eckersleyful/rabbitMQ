var amqp = require('amqplib');
const exchangeName = "topic_test"
const args = process.argv.slice(2)
const msg = args[1] || "Hello World"
const key = "my.o"


const receiveMsg = async () => {

    console.log(key)

    const connection = await amqp.connect('amqp://rabbit:5672');
    const channel = await connection.createChannel();
    await channel.assertExchange(exchangeName, 'topic', {durable: false});
    const q = await channel.assertQueue('', {exclusive: true})
    console.log(`Waiting for messages in queue: ${q.queue}`);
    channel.bindQueue(q.queue, exchangeName, key)


    channel.consume(q.queue, msg => {
        if(msg.content){
            console.log("Received message")
        }
    });

};
receiveMsg();