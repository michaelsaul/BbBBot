// Add requirements
var restify = require('restify');
var builder = require('botbuilder');

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
var connector = new builder.ChatConnector({ appId: appId, appPassword: appPassword });
var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

// Create bot dialogs
var intents = new builder.IntentDialog();
bot.dialog('/', intents);

intents.matches(/^help/i, [
    function (session) {
        session.send("You can say what you want, or you can tell me 'change name'.");
    }
])

intents.matches(/^change name/i, [
    function (session) {
        session.beginDialog('/profile');
    },
    function (session, results) {
        session.send("You got it, you're now called %s", session.userData.name);
    }
]);

intents.matches(/^mahalo/i, [
    function (session) {
        session.send("You're welcome.");
    }
])

intents.onDefault([
    function (session, args, next) {
        if (!session.userData.name) {
            session.beginDialog('/profile');
        } else {
            next();
        }
    },
    function (session, results) {
        session.send("Aloha %s!, you look like you need a drink.", session.userData.name);
    }
]);

bot.dialog('/profile', [
    function (session) {
        builder.Prompts.text(session, "Aloha, what is your name?");
    },
    function (session, results) {
        session.userData.name = results.response;
        session.endDialog();
    }
]);