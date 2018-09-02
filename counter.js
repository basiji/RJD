/* UPDATER 

Information gathered : 
2- likes
3- dislikes
4- plays

*/
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
connection.query("SELECT * FROM app_podcasts ORDER BY id DESC", function(error, result){

var i = 0;                     
    function myLoop () {           
    setTimeout(function () {    
        counter(result[i]);
        i++;                     
        if (i < result.length) {            
            myLoop();             
        } else {
            console.log('Finished');
            process.exit();
        }                        
    }, 1000)
}

myLoop();       

});
function counter(podcast){

    var stream  = request(CONSTANTS.RJ_BASE_URL + podcast.link).pipe(fs.createWriteStream(__dirname + '/tmp/' + podcast.id + '.html'));
    stream.on('finish',function(){
    var document = fs.readFileSync(__dirname + '/tmp/' + podcast.id + '.html');;
    var root = parser.parse(document.toString());
    
    // Thumbnail, Likes, Dislikes, Plays
    var rates = root.querySelectorAll('span.rating');
    if(rates[0]) {
    var likes = rates[0].childNodes[0].rawText.split(' ')[0] || 0;
    var dislikes = rates[1].childNodes[0].rawText.split(' ')[0] || 0;
    var plays = root.querySelector('span.number_of_downloads').childNodes[0].rawText.split(' ')[0] || 0;
    } else 
        return;
    
    // Update record
    connection.query("UPDATE app_podcasts SET ? WHERE id = '" + podcast.id + "'", {
    likes:clean(likes),
    dislikes:clean(dislikes),
    plays:clean(plays),
    }, function(error){
    
        if(error)
            callback()
        else
            console.log(podcast.title + ' (' + podcast.episode + ') Updated');
        
        // Remove temp file
        fs.unlink(__dirname + '/tmp/' + podcast.id + ".html", function(){});

    }); // Insert record

    }); // Stream finished 
}

var clean = function(text){
    var num = text.replace(',','');
    num = parseInt(num);
    return num;
}
