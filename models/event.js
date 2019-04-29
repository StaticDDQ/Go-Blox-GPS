const mongoose = require('mongoose');

// events schema
const eventsSchema = new mongoose.Schema({
    "name": String,
    "date": Date,
    "address": String,
    "description": String,
    "email": String,
    "phone": String,
    "pictures": String,
    "tags": [String]
});

const Event = module.exports = mongoose.model('events', eventsSchema);