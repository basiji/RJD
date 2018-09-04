var mysql = require('mysql');
var CONSTANTS = require('../modules/constants.js');

var connection = mysql.createConnection(CONSTANTS.MySQL);
connection.connect(function(error){
    if(error)
    console.log(error);
});

// First -> unpopular and unfeature all podcasts
connection.query("UPDATE app_podcasts SET featured = 0, popular = 0", function(error){
    if(error)
        console.log(error);
        
    connection.query("SELECT * FROM app_shows", function (error, result){

        for (var i = 0; i < result.length; i++){
    
            var show = result[i];
            connection.query("SELECT * FROM app_podcasts WHERE showid = '" + show.id + "' ORDER BY episode DESC LIMIT 10", function(error, result){
    
                var podcasts = result;
    
                // Set last record as featured
                connection.query("UPDATE app_podcasts SET featured = 1 WHERE id = '" + podcasts[0].id + "'", function(error){
    
                    // Order rows by likes
                    podcasts.sort(function(p1, p2) {return p2.likes - p1.likes;});
    
                    // Set most likes as popular
                    connection.query("UPDATE app_podcasts SET popular = 1 WHERE id = '" + podcasts[0].id + "'", function(error){
                        if(error)
                        console.log(error);
                    });
    
                });
    
            });
            
        }
    
    });
    
})

