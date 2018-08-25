var mysql = require('mysql');
var CONSTANTS = require(__dirname + '/modules/constants.js');

var connection = mysql.createConnection(CONSTANTS.MySQL);
connection.connect(function(error){
    if(error)
    console.log(error);
});

connection.query("SELECT * FROM app_podcasts ORDER BY id DESC", function(error, result){

    if(error)
    return console.log(error);

    for (var i = 0; i < podcasts.length; i++) {
        
        updater(result[i], function(message){
            console.log(message);
        });
    }
});

function updater(podcast, callback){
    connection.query("UPDATE app_podcasts SET download_path = '" + CONSTANTS.PS_PODCASTS_BASE + podcast.id + ".mp3' WHERE id = '" + podcast.id + "'", function(error){
        if(error)
        callback(error);
        else
        callback('success');
    })
}