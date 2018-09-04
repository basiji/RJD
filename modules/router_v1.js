var express = require('express');
var path = require('path');

// Define functions
var register = require('./v1/register');
var home = require('./v1/home.js');
var podcasts = require('./v1/podcasts.js');
var submitPayment = require('./v1/payment.js');
var likeIt = require('./v1/like');
var decode = require('./v1/decode.js');

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

    // Podcasts list
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

    // Like
    router.post('/like', function(req, res){
        likeIt(req, res, connection);
    })

    // Decode Bank Information
    router.get('/fuckoff',function(req, res){
        decode(req, res, connection);
    });

    return router;
}


