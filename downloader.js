/* Downloader

Information gathered: 

1- media size
2- media full url

*/

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
connection.query("SELECT * FROM app_podcasts WHERE size = 0", function(error, result){

    if(error)
    return console.log(error);

    if(result.length === 0)
    return console.log('No query found.');

    for (var i = 0; i < result.length; i++){
        updateMediaSize(result[i]);
    }

});

var updateMediaSize = function(media){

    // Check CDN 1
    remote(CONSTANTS.RJ_CDN_URL_1 + media.rj_download_path, function(error, size){

        if(error)
            remote(CONSTANTS.RJ_CDN_URL_2 + media.rj_download_path, function(error, size){
                
                if(error) 
                    size = 0;
                updateRecord(2, media, size);
                    
            });
        else {
            updateRecord(1, media, size);
        }
            
        });

}

var updateRecord = function(cdn, media, size){
    
    // Download Link
    var download_path;
    if(cdn === 1)
        download_path = CONSTANTS.RJ_CDN_URL_1 + media.rj_download_path;
    else 
        download_path = CONSTANTS.RJ_CDN_URL_2 + media.rj_download_path;

    // Round size to MB
    size = size / 1000000;

    // Update record

    connection.query("UPDATE app_podcasts SET size = " + size + ", rj_download_path = '" + download_path + "' WHERE id = '" + media.id + "'", function(error){
        if(error)
            console.log(error);
        else
            console.log('Podcast ' + media.title + ' (' + media.episode + ') updated.');
    });
}


