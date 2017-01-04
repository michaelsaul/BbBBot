// Add requirements
var restify = require('restify');
var builder = require('builder');

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.PORT || 3000, function())
{
    console.log('%s listening to %s', server.name, server.url);
});

// Create chat bot
var connector = new builder.ChatConnector
({ appId: 'YourAppID', appPassword: 'YourAppPassword' });
var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

// Create bot dialoges
bot.dialog('/', function (session) {
    session.send("Hello World");
});
