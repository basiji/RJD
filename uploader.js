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
connection.query("SELECT * FROM app_podcasts WHERE uploaded = 0 ORDER BY id DESC LIMIT 100", function(error, result){

    if(result.length === 0)
        return console.log('Nothing to upload');

    var i = 0;                     
    function myLoop () {           
    setTimeout(function () {    
        uploader(result[i], function(title, result){
            console.log(title + " -> " + result);
        });
        i++;                     
        if (i < result.length) {            
            myLoop();             
        }                        
    }, 3000)
}

myLoop();       

});

function uploader (podcast, callback){
       
    var options = { 
        method: 'POST',
        url: 'http://api.parsaspace.com/v1/remote/new',
        headers:{
            authorization: 'Bearer ' + CONSTANTS.PS_TOKEN},
            form:{
                checkid: podcast.id,
                path: '/thumbnails/',
                url: podcast.thumb_path,
                domain: 'rc.parsaspace.com' ,
                filename: podcast.id + ".jpg"
            } 
        };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        else {
            try {
                var response = JSON.parse(body);
                var result = '';
                if(response.result === 'success')
                connection.query("UPDATE app_podcasts SET ps_thumb_path = '" + CONSTANTS.PS_THUMBNAILS_BASE + podcast.id + ".jpg', uploaded = 1 WHERE id = '" + podcast.id + "'", function (error){
                    if(error)
                    result = error;
                    else
                    result = 'success';
                    callback(podcast.title + "(" + podcast.episode + ")", result);
                    
                });    
            } catch (error) {
                return;
            }
            
        }
});
}
