var dateformat = require('dateformat');
function register(req, res, connection){
    var model = req.query.model;
    var subdate = dateformat(new Date(), 'yyyy-MM-d');
    
             // Insert new user
             connection.query("INSERT INTO app_users SET ?",{

                model:model,
                subdate:subdate,
             },function(error, result){

                if(error)
                return res.sendStatus(404);

                return res.json({userid:result.insertId});

             });
}
module.exports = register;