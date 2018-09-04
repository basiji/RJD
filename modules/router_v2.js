var express = require('express');
var path = require('path');

// Define functions
var home = require('./v2/home');
var register = require('./v2/register');
var podcasts = require('./v2/podcasts');
var podcast = require('./v2/podcast');
var submitPayment = require('./v2/payment');


module.exports = function(connection){
    
    var router = express.Router();

    // Home
    router.get('/home', function(req, res){
        home(req, res, connection);
    });

    // Register user
    router.post('/register', function (req, res){
        register(req, res, connection);
    });

    // Single Podcast
    router.get('/podcast', function(req, res){
        podcast(req, res, connection);
    })

    // Podcasts
    router.get('/podcasts', function(req, res){
        podcasts(req, res, connection);
    });

    // Gateway submission
    router.get('/submit', function(req, res){
        submitPayment(req, res, connection);
    });

    // Gateway HTML
    router.get('/gateway', function(req, res){

        // Set cookie
        res.cookie('userid', req.query.userid);
        res.cookie('plan', req.query.plan);
        res.sendFile(path.join(__dirname, '../html/ASAN', 'index.html'));
        

    });

    
    return router;
}


