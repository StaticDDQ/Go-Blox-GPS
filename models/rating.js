const mongoose = require('mongoose');

// review schema
const reviewSchema = new mongoose.Schema({
    "eventID": String,
    "eventName": String,
    "stars": Number,
    "desc": String,
    "userName": String,
    "datePublished": Date
}, { versionKey: false });

const Review = module.exports = mongoose.model('ratings', reviewSchema)