const mongoose = require('mongoose');

// places schema
const placeSchema = new mongoose.Schema({
    "placeName": String,
    "placeAddress": String,
    "placeDescription": String,
    "placePhone": String,
    "placeTags": String,
    "pictures": String
}, { versionKey: false });

const Place = module.exports = mongoose.model('places', placeSchema);
