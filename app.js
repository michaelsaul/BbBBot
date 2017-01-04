// Add requirements
var restify = require('restify');
var builder = require('builder');

// Get environment variables
var appId = process.env.MY_APP_ID || "Missing your app ID";
var appPassword = process.env.MY_APP_PASSWORD || "Missing your app Password";

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.PORT || 3000, function()
{
    console.log('%s listening to %s', server.name, server.url);
});

// Create chat bot
var connector = new builder.ChatConnector
({ appId: appId, appPassword: appPassword });
var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

// Create bot dialoges
bot.dialog('/', function (session) {
    session.send("Aloha, you look like you need a drink.");
});
