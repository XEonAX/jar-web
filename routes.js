var express = require('express');
var router = express.Router();
var path = require('path');
var isAuthenticated = function (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler 
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	if (req.isAuthenticated())
		return next();
	res.redirect('/auth');
};

module.exports = function (passport) {

	/* Redirect to home if not authenticated */
	router.get('/', isAuthenticated, function (req, res) {
		res.redirect('/home');
	});

	/* Handle Auth POST */
	router.post('/auth', passport.authenticate('auth', {
		successRedirect: '/home',
		failureRedirect: '/auth',
		failureFlash: 'true', // used string 'true' instead of boolean true to bypass https://github.com/jaredhanson/passport/issues/430
	}));

	/* GET Home Page */
	router.get('/home', isAuthenticated, function (req, res) {
		res.render('home', {
			User: req.user,
			title: 'JAR-Web',
			clientCheckboxes: [{
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
			}, ]
		});
	});
	/* GET Login Page */
	router.get('/auth', function (req, res) {
		res.render('auth',  { message: req.flash('message') });
	});
	/* Handle Logout */
	router.get('/signout', function (req, res) {
		req.logout();
		res.redirect('/');
	});

	return router;
};