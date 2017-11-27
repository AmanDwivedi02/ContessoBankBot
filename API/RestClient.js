var request = require('request');

exports.getStockData = function getData(url, session, companyCode, callback){
    request.get(url, function(err, res, body){
        if(err){
            console.log(err);
        } else {
            callback(body, companyCode, session);
        }
    });
};