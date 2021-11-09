var amqp = require('amqplib');

const exchangeName = "topic_test"
const key = "my.o"
function sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }
  
const sendMsg = async () => {


    console.log(key)
    //Connect to the rabbit container image
    const connection = await amqp.connect('amqp://rabbit:5672');
    const channel = await connection.createChannel();
    //Listen to the same exchange that was made in orig.js with the same key "my.o"
    await channel.assertExchange(exchangeName, 'topic', {durable: false});
    const q = await channel.assertQueue('', {exclusive: true})
    console.log(`Waiting for messages in queue: ${q.queue}`);
    channel.bindQueue(q.queue, exchangeName, key)


    channel.consume(q.queue, msg => {
        sleep(1000)

        //Forward the received message with a different routing key for the observer.js to pick up
        var new_msg = "Got " + msg.content
        console.log(new_msg)
        channel.publish(exchangeName, "my.i", Buffer.from(new_msg));
    });


};
sendMsg();