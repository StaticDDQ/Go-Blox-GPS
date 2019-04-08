var mongoose = require('mongoose');

exports.mSchema = new mongoose.Schema({
    "firstName": String,
    "lastName": String,
    "userName": String,
    "email": String,
    "DOB": Date,
    "password": String
});