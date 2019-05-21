const mongoose = require('mongoose');

// places schema
const placeSchema = new mongoose.Schema({
    "placeName": String,
    "placeAddress": String,
    "placeDescription": String,
    "placePhone": String,
    "category": String,
    "pictures": String,
    "location": [Object]
}, { versionKßey: false });

const Place = module.exports = mongoose.model('places', placeSchema);
