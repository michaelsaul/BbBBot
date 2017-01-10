var mongoose = require("mongoose");

module.exports = mongoose.model('Cocktail', {
    name: {
        type: String,
        default: ''
    },
    recipe: {
        type: String,
        default: ''
    },
    history: {
        type: String,
        default: ''
    }
});