var Cocktail = require('../models/cocktail.js');

module.exports = function (server) {

    // Get all cocktails.
    server.get('/api/cocktails', function(req, res, next) {
        Cocktail.find().exec(function (req, data) {
            res.send(data);
        })
    });

    // Get a cocktail.
    server.get('/api/cocktails/:cocktail_id', function(req, res) {
        Cocktail.findById(req.params.cocktail_id).exec(function(err,data) {
            if (err)
                res.send(err);
            res.send(data);
        })
    });

    // Create a cocktail.
    server.post('/api/cocktails', function(req, res) {
        Cocktail.create({
            name: req.params.name,
            recipe: req.params.recipe,
            history: req.params.history
        }, function (err, cocktail) {
            if (err)
            res.send(err);

        // Send item
            res.send(cocktail);
        });
    });

    // Delete a cocktail.
    server.del('/api/cocktails/:cocktail_id', function(req, res) {
        Cocktail.remove({
            _id: req.params.coctail_id
        }, function (err, cocktail) {
            if (err)
            res.send(err);

            getCocktails(res);
        });
    });

};