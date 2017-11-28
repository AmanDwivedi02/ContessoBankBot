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

exports.postFeedback = function(username, feedback, score){
    var options = {
        url: 'http://bankfeedback.azurewebsites.net/tables/bankFeedback',
        method: 'POST',
        headers: {
            'ZUMO-API-VERSION': '2.0.0',
            'Content-Type':'application/json'
        },
        json: {
            username: username,
            feedback: feedback,
            score: score
        }
    };
    
    request(options, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            console.log(body);
        }
        else{
            console.log(error);
        }
      });
};