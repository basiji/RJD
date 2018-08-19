module.exports = function (req, res, connection){
    
    // Receive last 20 podcasts
    // latest 10 -> featured
    // 10 most liked -> popular
    // Receive list of shows

    connection.query("SELECT * FROM app_podcasts ORDER BY episode DESC LIMIT 20", function (error, result){

        if(error)
        console.log(error);

        // Fill featured array
        var featured = result.slice(0, 9);
        
        // Order by likes
        result.sort(function(a,b) {return (a.likes > b.likes) ? 1 : ((b.likes > a.likes) ? -1 : 0);} );
        
        // Fill popular array
        var popular = result.slice(0,9);

        //Receive list of shows
        connection.query("SELECT * FROM app_shows ORDER BY RAND()", function(error, result){
            
            if(error)
            console.log(error);

            // Response JSON
            return res.json({
                featured:featured,
                popular:popular,
                shows:result
            });


        });
        
    });


}