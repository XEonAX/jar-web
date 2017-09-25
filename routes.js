var express = require('express');
var router = express.Router();
var Constants = require('./constants.js');
var Room = require('./models/room.js');
var crypto = require('crypto');
/**
 * Redirects the user to login page if not logged in, or calls the next request handler.
 * 
 * @param {Express.Request} req 
 * @param {Express.Response} res 
 * @param {NextFunction} next 
 * @returns 
 */
var isAuthenticated = function (req, res, next) {
    // if user is authenticated in the session, call the next() to call the next request handler 
    // Passport adds this method to request object. A middleware is allowed to add properties to
    // request and response objects
    if (req.isAuthenticated())
        return next();
    res.redirect('/auth');
};


/**
 * Hooks up the routing logic
 * 
 * @param {passport.PassportStatic} passport is required for authentication purposes
 * @returns {Router}
 */
module.exports = function (passport) {

    /* Redirect to home if authenticated */
    router.get('/', isAuthenticated, function (req, res) {
        res.redirect('/home');
    });

    /* Handle Auth POST requests*/
    router.post('/auth', passport.authenticate('auth', {
        successRedirect: '/home',
        failureRedirect: '/auth',
        failureFlash: 'true', // used string 'true' instead of boolean true to bypass https://github.com/jaredhanson/passport/issues/430
    }));

    /* GET Home Page */
    router.get('/home', isAuthenticated, function (req, res) {
        res.render('home', {
            User: req.user, //User Details
            title: Constants.Title,
            clientCheckboxes: [{ //Checkboxes to show on client page
                id: 'FWD',
                text: 'Fetch Websocket Details'
            }, {
                id: 'CTS',
                text: 'Connected to Server'
            }, {
                id: 'FLP',
                text: 'Fetch Launch Parameters'
            }, {
                id: 'TTYL',
                text: 'Try to Launch Client'
            }, {
                id: 'SWC',
                text: 'Synchronize with Client'
            }, {
                id: 'R',
                text: 'Ready'
            }, ],
            primaryColor: Constants.PrimaryColor,
            secondaryColor: Constants.SecondaryColor
        });
    });
    /* GET Authentication (login/Signup) Page */
    router.get('/auth', function (req, res) {
        res.render('auth', {
            title: Constants.Title,
            message: req.flash('message'), //Show Flash Message if any
            primaryColor: Constants.PrimaryColor,
            secondaryColor: Constants.SecondaryColor
        });
    });



    /* GET RoomDetails */
    router.get('/api', isAuthenticated, function (req, res) {
        console.log('ROUTER:rendering api JSON');
        Room.findOne({
            sessionid: req.sessionID
        }, function (err, room) {
            if (room != null) {
                console.log('ROUTER:room found :' + room.toString());
                res.cookie('btoken', room.btoken, {
                    path: '/ws/',
                    maxAge: 1000 * 60 * 10
                });
                console.log('ROUTER:btoken set to cookie');
                res.json({
                    ctoken: room.ctoken,
                    room: room.sessionid,
                });
                console.log('ROUTER:rendered ctoken and sessionid to json');
            } else {
                room = new Room();
                console.log('ROUTER:create new room');
                // set the user's local credentials
                room.sessionid = req.sessionID;
                room.btoken = crypto.randomBytes(16).toString('hex');
                room.ctoken = crypto.randomBytes(16).toString('hex');
                // save the user
                room.save(function (erri) {
                    if (erri) {
                        console.error('ROUTER:Error in saving room: ' + erri);
                        throw erri;
                    }
                    console.log('ROUTER:room saved :' + room.toString());
                    res.cookie('btoken', room.btoken, {
                        path: '/ws/',
                        maxAge: 1000 * 60 * 10
                    });
                    console.log('ROUTER:btoken set to cookie');
                    res.json({
                        ctoken: room.ctoken,
                        room: room.sessionid,
                    });
                    console.log('ROUTER:rendered ctoken and sessionid to json');
                });
            }
        });
    });

    /* Handle Logout */
    router.get('/signout', function (req, res) {
        req.logout();
        res.redirect('/');

    });

    return router;
};