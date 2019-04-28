const mongoose = require('mongoose');

// review schema
const reviewSchema = new mongoose.Schema({
    "eventID": Number,
    "stars": Number,
    "desc": String,
    "userName": String,
    "datePublished": Date
});

const Review = module.exports = mongoose.model('ratings', reviewSchema)