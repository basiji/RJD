module.exports = function(req, res, connection){

    // Recive showId
    if(!req.query.showid)
        return res.sendStatus(404);

    var showId = req.query.showid;

    // Receive list of podcasts
    var sql = '';
    if(showId === 'featured')
        sql = "SELECT * FROM app_podcasts WHERE featured = 1 ORDER by likes DESC";
    else if(showId === 'popular')
        sql = "SELECT * FROM app_podcasts WHERE popular = 1 ORDER by likes DESC";
    else 
        sql = "SELECT * FROM app_podcasts WHERE showid = '" + showId + "' ORDER BY episode DESC ";
    
    connection.query(sql,function(error, result){

        if(error || result.length === 0){
            console.log(error);
            return res.sendStatus(404);
        }

        return res.json(result);

    });

}