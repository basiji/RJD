/*  CRAWLER : Get all episodes of specific podcasts
Information gathered : 
1- title 
2- episode
3- link
*/
var fs = require('fs');
var parser = require('fast-html-parser');
var request = require('request');
var mysql = require('mysql');
var CONSTANTS = require(__dirname + '/modules/constants.js');
var connection = mysql.createConnection(CONSTANTS.MySQL);

// Establish MySQL connection
connection.connect(function(error){
    if(error)
    console.log(error);
});

/* Get updating podcasts */
connection.query("SELECT * FROM app_shows WHERE updated = 0 ORDER BY id DESC LIMIT 1", function(error, result){

    if(error)
    return console.log(error);

    if(result.length === 0){
        // Check all not updated
        connection.query("UPDATE app_shows SET updated = 0", function(error){
            if(error)
            console.log(error);
            return console.log('All shows updated -> reset done');
        })
    } else {
        // Check updated
        connection.query("UPDATE app_shows SET updated = 1 WHERE id = '" + result[0].id + "'", function(error){
            if(error)
            console.log(error);
        })
    }

    var show = result[0];
    var show_url = show.url;
    var showId = show.id;
    var numShows = show.numshows;
    
    var stream  = request(show_url).pipe(fs.createWriteStream('temp.html'));
    stream.on('finish',function(){
    var document = fs.readFileSync('temp.html');
    var root = parser.parse(document.toString());
    var blocks = root.querySelectorAll("a.block_container");
    var block, title, episode,link;

    // Check if new episode available
    if(blocks.length === numShows)
        return console.log('No updates available for '  + show.title);
    
    for (var i = 0; i < blocks.length - numShows - 1; i++) {
    
    block = blocks[i];
    // Get required information
    title =  block.childNodes[3].childNodes[1].childNodes[0].rawText;
    episode =  block.childNodes[3].childNodes[3].childNodes[0].rawText.split(' ')[1];
    link = block.rawAttrs.split('"')[1];
    
    // Insert into DB
    connection.query("INSERT INTO app_podcasts SET ?", {
        title:title,
        episode:episode,
        link:link,
        showid:showId
        }, function(error){
        if(error)
            console.log(error);
        else
            console.log('New podcast inserted ->' + title + '(' + episode + ')');
    }); 

    }   

        // Update numshows
        connection.query("UPDATE app_shows SET numshows = " + blocks.length + " WHERE id = '" + showId + "'", function(error){
            if(error)
                console.log(error);
            else
                console.log(show.title + '-> updated.');
        });

    }); // stream on finish
    }); // receive updating show


