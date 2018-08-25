var mysql = require('mysql');
var CONSTANTS = require(__dirname + '/modules/constants.js');

var connection = mysql.createConnection(CONSTANTS.MySQL);
connection.connect(function(error){
    if(error)
    console.log(error);
});

connection.query("SELECT * FROM app_podcasts ORDER BY id DESC", function(error, result){

    for (var i = 0; i < result.length; i++) {
        // Update download_path
        connection.query("UPDATE app_podcasts SET download_path = '" + CONSTANTS.PS_PODCASTS_BASE + result[i].id + '.mp3', function(error){

            if(error)
                console.log(error);
            else 
                console.log(result[i].title + '(' + result[i].episode + ') -> updated.');

        });
    }

});