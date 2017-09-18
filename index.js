var http = require('http');
var express = require('express');
var websocketserver = require('ws').Server;
var path = require('path');
var localStrategy = require('passport-local').Strategy;
var handlebars  = require('express-handlebars');
var mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var env = process.env;
var port = env.PORT || 3000;
var app = express();

var dbconnstr = process.env.MONGODB_DB_URL ? process.env.MONGODB_DB_URL : 'mongodb://localhost/passport';
mongoose.connect(dbconnstr, {
  useMongoClient: true
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
//Register 'public' directory for static handler
app.use(express.static(__dirname + '/public'));

app.engine('.hbs', handlebars({extname: '.hbs'}));
app.set('view engine', '.hbs');

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


var routes = require('./routes')(passport);
app.use('/', routes);


//create http server
var server = http.createServer(app);


//create websocket server on above http server
var wss = new websocketserver({
  server: server
});

console.log('http and ws server starting on port:' + port);

//Start the http and ws servers
server.listen(port);

