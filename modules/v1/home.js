module.exports = function (req, res, connection){
    
    // Receive last 20 podcasts
    // latest 10 -> featured
    // 10 most liked -> popular
    // Receive list of shows

    var popular;
    var featured;
    

    connection.query("SELECT * FROM app_podcasts WHERE featured = 1 ORDER BY id DESC LIMIT 10", function (error, result){

        if(error)
        console.log(error);

        featured = result;

        connection.query("SELECT * FROM app_podcasts WHERE popular = 1 ORDER BY likes DESC LIMIT 10", function(error, result){

            if(error)
            console.log(error);

            popular = result;

        //Receive list of shows
        connection.query("SELECT * FROM app_shows ORDER BY title ASC", function(error, result){
            
            if(error)
            console.log(error);

            // Response JSON
            return res.json({
                featured:featured,
                popular:popular,
                shows:result,
                buildnumber:1,
                update_url:'http://ps4club.ir/RC-4.apk',
            });

        });
        
    });
        
});


}