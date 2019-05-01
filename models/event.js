const mongoose = require('mongoose');

// events schema
const eventsSchema = new mongoose.Schema({
    "name": String,
    "date": Date,
    "organizer": String,
    "address": String,
    "description": String,
    "email": String,
    "phone": String,
    "pictures": String,
    "tags": [String],
    "joinedUsers": [String]
});

const Event = module.exports = mongoose.model('events', eventsSchema);