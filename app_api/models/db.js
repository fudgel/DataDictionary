var mongoose = require('mongoose');
var gracefulShutdown;
var dbURI = 'mongodb://localhost/registry';
var fs = require('fs');
var configurationFile = 'config.json';

// load config file to get mongodb config
var config = JSON.parse(
    fs.readFileSync(configurationFile)
);

dbURI = 'mongodb://'+config.server+':'+config.port+'/'+config.database;
if(config.debug){
    console.log('dbURI:'+dbURI);
}; 

mongoose.connect(dbURI);

// CONNECTION EVENTS
mongoose.connection.on('connected', function() {
    console.log('Mongoose connected to ' + dbURI);
});
mongoose.connection.on('error', function(err) {
    console.log('Mongoose connection error: ' + err);
});
mongoose.connection.on('disconnected', function() {
    console.log('Mongoose disconnected');
});

// CAPTURE APP TERMINATION / RESTART EVENTS
// To be called when process is restarted or terminated
gracefulShutdown = function(msg, callback) {
    mongoose.connection.close(function() {
        console.log('Mongoose disconnected through ' + msg);
        callback();
    });
};
// For nodemon restarts
process.once('SIGUSR2', function() {
    gracefulShutdown('nodemon restart', function() {
        process.kill(process.pid, 'SIGUSR2');
    });
});
// For app termination
process.on('SIGINT', function() {
    gracefulShutdown('app termination', function() {
        process.exit(0);
    });
});
// For Heroku app termination
process.on('SIGTERM', function() {
    gracefulShutdown('Heroku app termination', function() {
        process.exit(0);
    });
});

// BRING IN YOUR SCHEMAS & MODELS
require('./dataDictionary');
