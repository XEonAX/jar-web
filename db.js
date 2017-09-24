var mongoose = require('mongoose');
var Constants = require('./constants.js');
module.exports = {
    /**
     * Initializes Mongoose. And Hooks event handler for logging purposes
     * 
     */
    Init: function () {
        mongoose.connect(Constants.ConnectionString, {
            useMongoClient: true
        });

        // CONNECTION EVENTS
        // When successfully connected
        mongoose.connection.on('connected', function () {
            console.log('mongoose: connection open to ' + Constants.ConnectionString);
        });

        // If the connection throws an error
        mongoose.connection.on('error', function (err) {
            console.log('mongoose: connection error: ' + err);
        });

        // When the connection is disconnected
        mongoose.connection.on('disconnected', function () {
            console.log('mongoose: connection disconnected');
        });

        // If the Node process ends, close the Mongoose connection 
        process.on('SIGINT', function () {
            mongoose.connection.close(function () {
                console.log('mongoose: connection disconnected through app termination');
                process.exit(0);
            });
        });
    }
};