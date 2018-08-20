module.exports = function (req, res, connection){
    
    // Receive last 20 podcasts
    // latest 10 -> featured
    // 10 most liked -> popular
    // Receive list of shows

    connection.query("SELECT * FROM app_podcasts WHERE featured = 1 OR popular = 1 ORDER BY featured LIMIT 20", function (error, result){

        if(error)
        console.log(error);

        var featured = result.slice(0, 9);
        var popular = result.slice(10, result.length - 1);

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