var http = require('http');
var express = require('express');
var app = express();
var websocketserver = require('ws').Server;
var env = process.env;
var port = env.PORT || 5000;
var path = require('path');
var localStrategy = require('passport-local').Strategy;

var mongoose = require('mongoose');
var dbconnstr = process.env.MONGODB_DB_URL ? process.env.MONGODB_DB_URL : 'mongodb://localhost/passport';
mongoose.connect(dbconnstr, {
  useMongoClient: true
});
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
//Register 'public' directory for static handler
app.use(express.static(__dirname + '/public'));

// Configuring Passport
var passport = require('passport');
var expressSession = require('express-session');

app.use(expressSession({
  secret: 'jE9V0GbxEfGp0eax wc6E1xV5APwdAzt5 GqB63n8Bx8TwfLRr wAeQPVyAKWXLIqnM'
}));
app.use(passport.initialize());
app.use(passport.session());

// Using the flash middleware provided by connect-flash to store messages in session
// and displaying in templates
var flash = require('connect-flash');
app.use(flash());

// Initialize Passport
var initPassport = require('./passport/init');
initPassport(passport);





app.get('/', function(request, response) {
  response.send('Hello World!!');
});

app.get('/login.html', function(request, response) {
  var options = {
		root: path.join(__dirname, 'views'),
		dotfiles: 'deny',
		headers: {
			'x-timestamp': Date.now(),
			'x-sent': true
		}
	};
	response.sendFile('login.html', options, function (err) {
		if (err) {
			next(err);
		} else {
			console.log('Sent:', 'login.htm');
		}
	});
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

