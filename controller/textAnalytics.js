//Setting up required packages
var request = require('request');
var rest = require('../API/restClient');

//Function to process feedback
exports.obtainFeedback = function(session, username, feedback){
    //Calling text analytics API
    request.post({
        url: 'https://westcentralus.api.cognitive.microsoft.com/text/analytics/v2.0/sentiment',
        json: true,
        headers: {
            'Ocp-Apim-Subscription-Key': '3e8faa7dadb04e3287978d548b5aabc6',
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: {
            'documents':[
                {
                    'language': 'en',
                    'id': '1',
                    'text': feedback
                }
            ]
        }
    }, function (error, response, body){
        //console.log(validResponse(body));
        if (error){
            return console.error ('failure: ', error);
        }
        console.log('Something\'s happening: ', feedback);
        session.send(validResponse(body, username));
    });
};

function validResponse(body, username){
    if (body && body.documents && body.documents[0].score){
        //Call easy tables functionality///////////////////////////////////////////////
        console.log('HIT');
        var feedback = body.documents[0].score;
        if (feedback >= 0.75){
            rest.postFeedback(username, 'Great', feedback);
            return 'Thank you for your feedback!'
        } else if (feedback >= 0.5){
            rest.postFeedback(username, 'Good', feedback);
            return 'Thank you for your feedback!'
        } else if (feedback >= 0.25) {
            rest.postFeedback(username, 'Bad', feedback);
            return 'We apologise for the incovenience and thank you for your feedback.'
        } else if (feedback >= 0) {
            rest.postFeedback(username, 'Terrible', feedback);
            return 'We apologise for the incovenience and thank you for your feedback.'
        }        
    } else{
        console.log('Score value: ', body.documents[0].score);
        return 'Something went wrong, please try again!'
    }
}

exports.sendFeedback = function(session, username, feedback){
    var url = 'http://bankfeedback.azurewebsites.net/tables/bankFeedback';
    rest.postFeedback(url, username, feedback);
};
