var mysql = require('mysql');
var CONSTANTS = require(__dirname + '/modules/constants.js');

var connection = mysql.createConnection(CONSTANTS.MySQL);
connection.connect(function(error){
    if(error)
    console.log(error);
});

connection.query("SELECT * FROM app_shows", function (error, result){

    for (var i = 0; i < result.length; i++){

        var show = result[i];
        // Featured SQL
        var sql_featured = "UPDATE app_podcasts SET featured = 1 WHERE id = (SELECT MAX(id) FROM app_podcasts WHERE showid = '" + show.id + "')";
        // Popular SQL
        var sql_popular = "UPDATE app_podcasts SET popular = 1 WHERE id = (SELECT id FROM app_podcasts WHERE showid = '" + show.id + "' ORDER BY likes DESC LIMIT 1)";

        connection.query(sql_featured, function(error){
            if(error)
            console.log(error);

            connection.query(sql_popular, function(error){
                if(error)
                console.log(error);
            });
        });

    }

});
