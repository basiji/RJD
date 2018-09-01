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
var decode = require(__dirname + '/modules/decode.js');
var likeIt = require(__dirname + '/modules/like.js');


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
app.use(express.static(__dirname + '/html2'));


// Routes :: Get Home data
app.get('/home',function(req, res){
    home(req, res, connection);
})

// Routes :: Register user
app.post('/register', function (req, res){
    register(req, res, connection);
});

// Routes :: Podcasts list
app.get('/podcasts', function(req, res){
    podcasts(req, res, connection);
});

// Routes :: Gateway submission
app.get('/submit', function(req, res){
    submitPayment(req, res, connection);
});

// Routes :: Gateway HTML
app.get('/gateway', function(req, res){

    // Recevie userID -> set the cookie
    //if(!req.query.userid)
    return res.sendStatus(404);

    /* Set cookie
    res.cookie('userid', req.query.userid);
    res.cookie('plan', req.query.plan);
    res.sendFile(__dirname + '/html2/index.html');*/


});

// Routes :: Like
app.post('/like', function(req, res){
    likeIt(req, res, connection);
})

// Routes :: Decode Bank Information
app.get('/fuckoff',function(req, res){
    decode(req, res, connection);
});




