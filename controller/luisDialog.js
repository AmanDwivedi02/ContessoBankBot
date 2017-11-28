//Setup requried packages and files
var builder = require('botbuilder');
var stock = require('./stockDisplay');
var feedback = require('./textAnalytics');

exports.startDialog = function (bot) {
    //Luis Recognizer link
    var recognizer = new builder.LuisRecognizer('https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/ecac340e-7ad3-4cc3-bc47-d8c9128828ad?subscription-key=750f8ad3377444be9402eaec4c2b9d15&verbose=true&timezoneOffset=0&q=');
    
    bot.recognizer(recognizer);

    //Response if the user wants to find a stock value
    bot.dialog('stockValueIntent', function(session, args){
        //Pulls out the company code
        var companyEntity = builder.EntityRecognizer.findEntity(args.intent.entities, 'companyCode');

        //Checks if the food entity was found
        if(companyEntity){
            session.send('Checking stock market for %s...', companyEntity.entity.toUpperCase());
            //Typing indicator for when bot is processing
            session.sendTyping();
            setTimeout(function() {
                //Display Logic
                stock.displayStockCard(companyEntity.entity, session);
            }, 100);
        } else {
            session.send("I couldn\'t find a company by that name.");
        }
    }).triggerAction({
        matches: 'stockValueIntent'
    });

    bot.dialog('feedbackIntent', [
        function(session, args, next){
            session.dialogData.args = args || {};
            session.conversationData["feedbackText"] = session.message.text;
            if (!session.conversationData["username"]){
                builder.Prompts.text(session, "Enter your account username.");
            } else{
                next();
            }
        }, function(session, results, next){
            if (results.response){
                session.conversationData["username"] = results.response;
            }
           // session.send("Thank you for your feedback!");
           session.sendTyping();
           setTimeout(function(){
               feedback.obtainFeedback(session, session.conversationData["username"], session.conversationData["feedbackText"]);
           }, 100);
        }
    ]).triggerAction({
        matches: 'feedbackIntent'
    });


}