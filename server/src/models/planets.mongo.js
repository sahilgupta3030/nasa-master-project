const mongoose = require('mongoose');

// this is the schema for the planets collection
const planetsSchema = new mongoose.Schema({
    keplerName: {
        type: String,
        required: true,
    },
});

// this is the model for the planets collection
// connects planetsSchema to the planets collection in the database
module.exports = mongoose.model('Planet', planetsSchema);
