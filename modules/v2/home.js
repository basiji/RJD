module.exports = function (req, res, connection){
    
    // Receive last 20 podcasts
    // latest 10 -> featured
    // 10 most liked -> popular
    // Receive list of shows

    var popular;
    var featured;
    var shows;
    var queries = 'id, title, episode, thumb_path, download_path, likes, dislikes, plays, size';
    
    // Featured
    connection.query("SELECT " + queries + " FROM app_podcasts WHERE featured = 1 ORDER BY id DESC LIMIT 10", function (error, result){

        if(error)
        console.log(error);

        featured = result;

        // Popular
        connection.query("SELECT " + queries + " FROM app_podcasts WHERE popular = 1 ORDER BY likes DESC LIMIT 10", function(error, result){

            if(error)
            console.log(error);

            popular = result;

        // Shows
        connection.query("SELECT * FROM app_shows ORDER BY title ASC", function(error, result){
            
            if(error)
            console.log(error);

            shows = result;


            // Sliders
            connection.query("SELECT * FROM app_sliders ORDER BY position ASC", function(error, result){
                
                if(error)
                    console.log(error);

                var slides = result;
                var ids = [];
                var index = [];
                
                // Get list of podcast slides (ids)
                for (var i = 0; i < slides.length; i++) 
                    if(slides[i].type === 'podcast')  {
                        ids.push(slides[i].id);
                        index.push(i);
                    }


                // Get related podcasts
                connection.query("SELECT " + queries +  " FROM app_podcasts WHERE id IN (" + ids.join(',') + ")", function(error, result){

                    if(error)
                        console.log(error);
                    else
                        for (var i = 0; i < result.length; i++) 
                            slides[index[i]].podcast = result[i];
                    
                // Response JSON
                return res.json({
                    featured:featured,
                    popular:popular,
                    shows:shows,
                    slides:slides,
                    buildnumber:2,
                    version:'1.2.2',
                    update_url:'http://ps4club.ir/RC-4.apk',
                });


                });

                
                


            });

            

            
        });
        
    });
        
});


}