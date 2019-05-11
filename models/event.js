const mongoose = require('mongoose');
var random = require('mongoose-simple-random');

// events schema
const eventsSchema = new mongoose.Schema({
    "name": String,
    "startDate": Date,
    "startTime": String,
    "endDate": Date,
    "endTime": String,
    "organizer": String,
    "address": String,
    "description": String,
    "email": String,
    "phone": String,
    "pictures": String,
    "tags": [String],
    "joinedUsers": [String],
    "location" : [Object]
}, { versionKey: false });

eventsSchema.plugin(random);
const Event = module.exports = mongoose.model('events', eventsSchema);