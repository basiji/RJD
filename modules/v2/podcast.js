module.exports = function(req, res, connection){

    if(!req.query.id)
        return res.sendStatus(404);

    var id  = req.query.id;
    connection.query("SELECT * FROM app_podcasts WHERE id = '" + id + "'", function(error, result){
        if(error || result.length === 0)
            return res.sendStatus(404);
            
        return res.json(result[0]);
    })

}