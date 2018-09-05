// Core dependencies
var express = require('express');
var mysql = require('mysql');
var CONSTANTS = require(__dirname + '/modules/constants.js');
var app = express();

// MySQL Connection
var connection = mysql.createConnection(CONSTANTS.MySQL);
connection.connect(function(error){
    if(error)
    console.log(error);
});

// Define routers
var router_v1 = require(__dirname + '/modules/router_v1')(connection);
var router_v2 = require(__dirname + '/modules/router_v2')(connection);

// Create server
app.listen(CONSTANTS.PORT, function(){
    console.log('Listening on port : ' + CONSTANTS.PORT);
});

// Serve static resources
app.use(express.static(__dirname + '/html/ASAN', {maxAge:86400000*7}));

// Router versioning
app.use('/', router_v1);
app.use('/v1', router_v1);
app.use('/v2', router_v2);




