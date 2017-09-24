var http = require('http');
var express = require('express');
var websocketserver = require('ws').Server;
var handlebars = require('express-handlebars');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var Constants = require('./constants.js');
var app = express();
var db = require('./db.js');
db.Init();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
//Register 'public' directory for static handler
app.use(express.static(__dirname + '/public'));

app.engine(Constants.HandlebarsExtn, handlebars({
    extname: Constants.HandlebarsExtn
}));
app.set('view engine', Constants.HandlebarsExtn);

// Configuring Passport
var passport = require('passport');
var expressSession = require('express-session');

app.use(expressSession({
    secret: Constants.SessionSecret
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

console.log('http and ws server starting on port:' + Constants.Port);

//Start the http and ws servers
server.listen(Constants.Port);