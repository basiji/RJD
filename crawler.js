var fs = require('fs');
var parser = require('fast-html-parser');
var request = require('request');
var mysql = require('mysql');
var CONSTANTS = require(__dirname + '/modules/constants.js');
var connection = mysql.createConnection(CONSTANTS.MySQL);
var dubways_all_url = 'https://www.radiojavan.com/podcasts/browse/show/Dynatomix';

// Establish MySQL connection
connection.connect(function(error){
    if(error)
    console.log(error);
});

var stream  = request(dubways_all_url).pipe(fs.createWriteStream('temp.html'));
stream.on('finish',function(){
    var document = fs.readFileSync('temp.html');
    var root = parser.parse(document.toString());
    var blocks = root.querySelectorAll("a.block_container");
    var block;
    var title, episode, thumbnail, link, likes, dislikes, plays;
    for (var i = 0; i < blocks.length; i++) {
    
    block = blocks[i];
    // Get required information
    title =  block.childNodes[3].childNodes[1].childNodes[0].rawText;
    episode =  block.childNodes[3].childNodes[3].childNodes[0].rawText.split(' ')[1];
    thumbnail =  block.childNodes[1].childNodes[1].rawAttrs.split('"')[1];
    link = block.rawAttrs.split('"')[1];
    
    // Insert into DB
    connection.query("INSERT INTO app_podcasts SET ?", {
        title:title,
        episode:episode,
        thumb_path:thumbnail,
        link:link
    }, function(error){
        if(error)
        console.log(error);
    });
} 
});


// Extract audio from episode page
var getPodcastAudio = function (url, htmlname){
    var stream  = request(url).pipe(fs.createWriteStream(htmlname));
    stream.on('finish', function (){
        var document = fs.readFileSync(htmlname);
        var root = parser.parse(document.toString(), {
        script:true
        });
        var block = root.querySelectorAll('script')[9];
        console.log("Audio url : " + block.childNodes[0].rawText.split('=')[1].split("'")[1] + ".mp3" + "\n");
        //fs.unlink(htmlname, function(){
            
        //});
    });
}



