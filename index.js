// Core dependencies
var express = require('express');
var mysql = require('mysql');
var CONSTANTS = require(__dirname + '/modules/constants.js');
var app = express();

// Route Handlers
var register = require(__dirname + '/modules/register.js');
var home = require(__dirname + '/modules/home.js');
var podcasts = require(__dirname + '/modules/podcasts.js');
var submitPayment = require(__dirname + '/modules/payment.js');


// MySQL Connection
var connection = mysql.createConnection(CONSTANTS.MySQL);
connection.connect(function(error){
    if(error)
    console.log(error);
});

// Create server
app.listen(CONSTANTS.PORT, function(){
    console.log('Listening on port : ' + CONSTANTS.PORT);
});

// Serve static resources
app.use(express.static(__dirname + '/html'));

// Routes :: Get Home data
app.get('home',function(req, res){
    home(req, res, connection);
})

// Routes :: Register user
app.post('register', function (req, res){
    register(req, res, connection);
});

// Routes :: Podcasts list
app.get('podcasts', function(req, res){
    podcasts(req, res, connection);
});

// Routes :: Gateway submission
app.post('submit', function(req, res){
    submitPayment(req, res, connection);
});

// Routes :: Gateway HTML
app.get('gateway', function(req, res){

    // Recevie userID -> set the cookie
    if(!req.query.userid)
    return res.sendStatus(404);

    // Set cookie
    res.cookie('userid', req.query.userid);
    res.sendFile(__dirname + '/html/index.html');

});

