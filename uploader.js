/*  Uploader 

Function : 
1- Upload podcasts thumbnail -> /thumbnails/
2- Upload podcasts file -> /mp3/

*/

var request = require('request');
var mysql = require('mysql');
var CONSTANTS = require(__dirname + '/modules/constants.js');


var connection = mysql.createConnection(CONSTANTS.MySQL);
connection.connect(function(error){
    if(error)
    console.log(error);
});

// Get list of not uploaded media (5 items)
connection.query("SELECT * FROM app_podcasts WHERE uploaded = 0 ORDER BY id DESC LIMIT 5", function(error, result){

    var podcast;
    var options;

    // Loop 
    for (var i = 0; i < 1; i++) {

        podcast = result[i];
        options = { 
            method: 'POST',
            url: 'http://api.parsaspace.com/v1/remote/new',
            headers:{
                authorization: 'Bearer ' + CONSTANTS.PS_TOKEN},
                form:{
                    checkid: podcast.id,
                    path: '/podcasts/',
                    url: podcast.download_path,
                    domain: 'rc.parsaspace.com' ,
                    filename: podcast.id + ".mp3"
                } 
            };
    
        request(options, function (error, response, body) {
            if (error) throw new Error(error);
            else {
                // Update podcasts download path and upload status
                connection.query("UPDATE app_podcasts SET download_path = '" + CONSTANTS.PS_PODCASTS_BASE + podcast.id + ".mp3', uploaded = 1 WHERE id = '" + podcast.id + "'", function (error){
                    if(error)
                    console.log(error);
                    else
                    console.log(podcast.title + "(" + podcast.episode + ") -> uploaded!");   
                });
            }
});


    }

});
