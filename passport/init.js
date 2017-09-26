var auth = require('./auth');
var User = require('../models/user');

/**
 * Initialize Passport's User Serialize/Deserialize and Authentication Module
 * 
 * @param {passport.PassportStatic} passport 
 */
module.exports = function (passport) {

    passport.serializeUser(function (user, done) {
        console.log('passport:serializing user: ');
        console.log(user);
        done(null, user._id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            console.log('passport:deserializing user:', user);
            done(err, user);
        });
    });

    auth(passport);
};