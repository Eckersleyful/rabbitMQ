var amqp = require('amqplib');
const exchangeName = "topic_test"
const key = "#"
const fs = require('fs')

const receiveMsg = async () => {
    //Connect to the same rabbit image
    const connection = await amqp.connect('amqp://rabbit:5672');
    const channel = await connection.createChannel();
    await channel.assertExchange(exchangeName, 'topic', {durable: false});
    const q = await channel.assertQueue('', {exclusive: true})
    console.log(`Waiting for messages in queue: ${q.queue}`);

    //Listen to a queue with the same exchangename and any routing key "#"
    channel.bindQueue(q.queue, exchangeName, key)


    var first_row = true
    await channel.consume(q.queue, msg => {
        
        //if this is the first message, first delete the text file
        //from the container so there is only 6 rows in total
        try {
            if(first_row){
                fs.unlink("../data/observer.txt", function (err) {
                    console.log('File deleted!');
                });
                first_row = !first_row;
            }
        }
        catch (err){
            console.log("File non-existable")
        }
        //The actual message part of the received data
        msg_content = msg.content.toString()

        var new_date = new Date();
        
        //Construct the timestamp from Date object functions and the received message data and write it into the file
        fs.appendFile("../data/observer.txt", (new_date.getFullYear() + "-" + new_date.getMonth() + "-" + new_date.getDate()
        + "T" + new_date.getUTCHours() + ":" + new_date.getUTCMinutes() + ":" +
        new_date.getUTCSeconds() + ":" + new_date.getUTCMilliseconds() +
        " Topic "  + msg.fields.routingKey +": "+ msg_content +"\n"), function(err){
            if(err) {
                return console.log(err)
            }
            console.log("Wrote line to file")
        });
    });

};
receiveMsg();