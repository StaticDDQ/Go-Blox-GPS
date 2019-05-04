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
    "pictures": Object,
    "tags": [String],
    "joinedUsers": [String]
}, { versionKey: false });

const Event = module.exports = mongoose.model('events', eventsSchema);