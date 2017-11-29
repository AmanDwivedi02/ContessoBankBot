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

exports.getFeedback = function(session, callback){
    var options = {
        url: 'http://bankfeedback.azurewebsites.net/tables/bankFeedback',
        method: 'GET',
        headers: {
            'ZUMO-API-VERSION': '2.0.0',
            'Content-Type':'application/json'
        },
    };
    
    request(options, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            console.log(body);
            callback(body, session);
        }
        else{
            console.log(error);
        }
      });
};

exports.deleteFeedback = function(session, id){
    console.log('hit1');
    var url = 'http://bankfeedback.azurewebsites.net/tables/bankFeedback' + '\\' + id;
    console.log(url);
    var options = {
        url: url,
        method: 'DELETE',
        headers: {
            'ZUMO-API-VERSION': '2.0.0',
            'Content-Type':'application/json'
        }
    };
    console.log('hit2');
    request(options,function (err, res, body){
        if(!err && res.statusCode === 200){
            console.log(body);
            console.log('Done');
            session.send('Your feedback has been removed.');
        }else {
            session.send('Oops, something went wrong!');
            console.log('Heres the error');
            console.log(err);
            console.log(res);
        }
    })
};