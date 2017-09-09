var http = require('http');
var express = require('express');
var app = express();
var websocketserver = require('ws').Server;
var env = process.env;
var port = env.PORT || 5000;

//Register 'public' directory for static handler
app.use(express.static(__dirname + '/public'));

app.get('/', function(request, response) {
  response.send('Hello World!!');
});


//create http server
var server = http.createServer(app);


//create websocket server on above http server
var wss = new websocketserver({
  server: server
});

console.log('http and ws server starting on port:' + port);

//Start the http and ws servers
server.listen(port);

