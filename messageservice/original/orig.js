var amqp = require('amqplib');

//The name of the rabbitMQ exchange service
const exchangeName = "topic_test"

//The rabbitmq key for the message routing
const key = "my.o"

const sendMsg = async () => {
    //Timeout so we don't send messages before the broker services are up
    await new Promise(r => setTimeout(r, 12000));

    //create a connection to rabbit AKA the rabbit image container
    const connection = await amqp.connect('amqp://rabbit:5672');
    const channel = await connection.createChannel();
    //Create exchange service with the exchange name
    await channel.assertExchange(exchangeName, 'topic', {durable: false});
    
    //Send out 3 messages every 3 seconds
    for(let i = 1; i <= 3; i++){
        var msg = "MSG_" + i 
        
        channel.publish(exchangeName, key, Buffer.from(msg));
        console.log(" [x] Sent %s", msg);
        await new Promise(r => setTimeout(r, 3000));
    }
    
    //Timeout in case of failure, exits process
    setTimeout(() => {
        connection.close();
        process.exit(0)
    }, 500);

};
sendMsg();