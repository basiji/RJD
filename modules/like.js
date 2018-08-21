module.exports = function(req, res, connection){

    // Check for podastId, userId
    var pID = req.query.pid;
    var uID = req.query.uid;
    
    // Check for method
    var method = req.query.method;

    var sql = '';
    if(method === 'like')
        sql = "UPDATE app_podcasts SET likes = likes + 1 WHERE id = '" + pID + "'";
    if(method === 'dislike')
        sql = "UPDATE app_podcasts SET dislikes = dislikes + 1 WHERE id = '" + pID + "'";
    
    connection.query(sql, function(error){
        
        if(error)
        return res.sendStatus(404);

        return res.sendStatus(200);


    });

}