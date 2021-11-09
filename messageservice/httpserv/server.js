var http = require("http")
var fs = require("fs")
 
http.createServer(function(req,res) {

    //Try to read the data from the shared container volume
    fs.readFile("../data/observer.txt", function(err, data) {
        if(data == undefined){
            console.log("Bad data");
            return res.end()
        }

        //If the file was found, return it whole and end the http request
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        return res.end();

    });
}).listen(8080);   