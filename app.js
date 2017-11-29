//Setup requried packages and files
var builder = require('botbuilder');
var restify = require('restify');
var luis = require('./controller/luisDialog');

//Setup restify server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url); 
 });
 
 // Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: '1dd3f1ef-ef64-48d6-8bb8-f14d33f36674',
    appPassword: 'crqJZKWB38(*ymdrZB167))'
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());

// Receive messages from the user and respond by echoing each message back (prefixed with 'You said:')
var bot = new builder.UniversalBot(connector, function (session) {
    session.send("Sorry, I did not understand \'%s\'. Type \'help\' to see all functons.", session.message.text);
});

//Calls dialog function in luisDialog.js
luis.startDialog(bot);