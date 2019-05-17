const mongoose = require('mongoose');

// events schema
const eventsSchema = new mongoose.Schema({
    "name",
    "startDate": String,
    "startTime": String,
    "endDate": String,
    "endTime": String,
    "organizer": String,
    "address": String,
    "description": String,
    "email": String,
    "phone": String,
    "pictures": String,
    "tags": [String],
    "joinedUsers": [String],
    "location": [Object]
}, { versionKey: false });

const Event = module.exports = mongoose.model('events', eventsSchema);