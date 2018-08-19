var mysql = require('mysql');
var remote = require('remote-file-size');
var CONSTANTS = require(__dirname + '/modules/constants.js');
var connection = mysql.createConnection(CONSTANTS.MySQL);

// Establish MySQL connection
connection.connect(function(error){
    if(error)
    console.log(error);
});

// Get Records
connection.query("SELECT * FROM app_podcasts WHERE size = NULL", function(error, result){

    if(error)
    return console.log(error);

    if(result.length === 0)
    return console.log('No query found.');

    for (var i = 0; i < 1; i++){
        updateMediaSize(result[i]);
    }

});

var updateMediaSize = function(media){

    // Check CDN 1
    remote(CONSTANTS.RJ_CDN_URL_1 + media.download_path, function(error, size){

        if(error)
            remote(CONSTANTS.RJ_CDN_URL_2 + media.download_path, function(error, size){
                
                if(error) 
                    size = 0;
                updateRecord(result.id, size);
                    
            });
        else {
            updateRecord(result.id, size);
        }
            
        });

}

var updateRecord = function(id, size){
    // Update record
    connection.query("UPDATE app_podcasts SET size = " + size + " WHERE id = '" + id + "'", function(error){
        if(error)
        console.log(error);
    });
}


