// Get environment variables
var appId = process.env.MY_APP_ID || "Missing your app ID";
var appPassword = process.env.MY_APP_PASSWORD || "Missing your app Password";
var model = process.env.MY_LUIS_URL || "Missing your LUIS URL";
var appInsightsKey = process.env.APPINSIGHTS_INSTRUMENTATIONKEY || "Missing AppInsights key";

// Add requirements
var restify = require('restify');
var builder = require('botbuilder');
var telemetyModule = require('./telemetry-module.js');

var appInsights = require("applicationinsights");
appInsights.setup(appInsightsKey).start();
var appInsightsClient = appInsights.getClient();


// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.PORT || 3000, function()
{
    console.log('%s listening to %s', server.name, server.url);
});

// Create LUIS Recognizer that points to my model
var recognizer = new builder.LuisRecognizer(model);

// Create chat bot
var connector = new builder.ChatConnector({ appId: appId, appPassword: appPassword });
var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

// Create bot dialogs
var intents = new builder.IntentDialog({recognizers: [recognizer]});

bot.dialog('/', function(session) {
    var telemetry = telemetyModule.createTelemetry(session);

    session.send('Aloha and welcome to the BbBBot!')
        if (!session.userData.name) {
            session.beginDialog('/profile');
        } else {
            session.beginDialog('/begin');
        };
    appInsightsClient.trackTrace("start", telemetry);

    session.beginDialog('/begin');

    });

bot.dialog('/begin', intents);

intents.matches('GetRecipe', [
function (session, args, next) {
    // Try extracting entities
    var cocktailEntity = builder.EntityRecognizer.findEntity(args.entities, 'Cocktail');
    session.send("I will get that %s recipe for you.", cocktailEntity.entity);
}
])

intents.matches('GetHistory', [
    function (session, args, next) {
        // Try extracting entities
        var cocktailEntity = builder.EntityRecognizer.findEntity(args.entities, 'Cocktail');
        session.send("History of %s, coming right up!", cocktailEntity.entity);
    }
])

intents.matches(/^help/i, [
    function (session) {
        session.send("Aloha! Try asking me things like 'how do I make a Mai Tai', 'who invented the Zombie', or you can ask me to 'change name'.");
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

intents.matches(/^goodbye/i, [
    // Resets userdata
    function (session) {
        delete session.userData[UserNameKey];
        session.send("Goodbye!");
        session.endDialog;
    }
])

bot.dialog('/profile', [
    function (session) {
        builder.Prompts.text(session, "Aloha, what is your name?");
    },
    function (session, results) {
        session.userData.name = results.response;
        session.endDialog();
    }
]);

intents.onDefault([
    function (session, results) {
        session.send("Aloha %s! Ask me about Tiki Drinks. Type 'help' if you need assistance with anything else.", session.userData.name);
    }
]);