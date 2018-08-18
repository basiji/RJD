module.exports = function(req, res, connection){

    // Recive showId
    if(!req.query.showid)
        return res.sendStatus(404);

    var showId = req.query.showid;

    // Receive list of podcasts
    connection.query("SELECT * FROM app_podcasts ORDER BY episode DESC WHERE showid = '" + showId + "'",function(error, result){

        if(error || result.length === 0)
            return res.sendStatus(404);

        return res.json(result);

    });

}