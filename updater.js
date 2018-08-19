var fs = require('fs');
var request = require('request');
var parser = require('fast-html-parser');
var remote = require('remote-file-size');
var mysql = require('mysql');
var CONSTANTS = require(__dirname + '/modules/constants.js');

var connection = mysql.createConnection(CONSTANTS.MySQL);
connection.connect(function(error){
    if(error)
    console.log(error);
});

// Get records
connection.query("SELECT * FROM app_podcasts WHERE download_path = ''", function(error, result){

    // Loop through result
    for (var i = 0; i < result.length; i++){
        updateRecord(result[i].id, result[i].link, connection);
    }

});

var updateRecord = function(id, link, connecttion){

    var stream  = request(CONSTANTS.RJ_BASE_URL + link).pipe(fs.createWriteStream(__dirname + '/tmp/' + id + '.html'));

    stream.on('finish',function(){
    var document = fs.readFileSync(__dirname + '/tmp/' + id + '.html');;
    var root = parser.parse(document.toString(), {
        script:true
    });
    
    // Likes, Dislikes, Plays
    var rates = root.querySelectorAll('span.rating');
    var likes = rates[0].childNodes[0].rawText.split(' ')[0];
    var dislikes = rates[1].childNodes[0].rawText.split(' ')[0];
    var plays = root.querySelector('span.number_of_downloads').childNodes[0].rawText.split(' ')[0];
    
    // Download path, size
    var scripts = root.querySelectorAll('script');
    for (var i = 0; i < scripts.length; i++){
        if(scripts[i].childNodes[0])
            if(scripts[i].childNodes[0].rawText.includes('RJ.currentMP3Url'))
                var download_path = scripts[i].childNodes[0].rawText.split(';')[0].split('=')[1].split("'")[1] + ".mp3";
    }

    // Get download size
    remote(CONSTANTS.RJ_BASE_URL + download_path, function(err, size) {
        
    // Update record
    connection.query("UPDATE app_podcasts WHERE id = '" + id + "' SET ?", {
    likes:likes,
    dislikes:dislikes,
    plays:plays,
    download_path:download_path,
    size:size
    }, function(error){
    
        if(error)
        console.log(error);
        // Remove temp file
        fs.unlink(__dirname + '/tmp/' + id + ".html", function(){});
    
    }); // Insert record

    }); // Remote get size

    }); // Stream finished 
}
