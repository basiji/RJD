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
connection.query("SELECT * FROM app_podcasts WHERE uploaded = 0 ORDER BY id DESC LIMIT 20", function(error, result){

   for (var i = 0; i < result.length; i ++) {
       uploader(result[i], function(title, result){
           console.log(title + " -> " + result);
       });
   }
});

function uploader (podcast, callback){
       
    var options = { 
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
            var response = JSON.parse(body);
            var result = '';
            if(response.result === 'success')
            connection.query("UPDATE app_podcasts SET ps_download_path = '" + CONSTANTS.PS_PODCASTS_BASE + podcast.id + ".mp3', uploaded = 1 WHERE id = '" + podcast.id + "'", function (error){
                if(error)
                result = error;
                else
                result = 'success';
                callback(podcast.title + "(" + podcast.episode + ")", result);
                
            });
        }
});
}
