var mongoose = require('mongoose');

const mSchema = mongoose.Schema({
    "firstName": String,
    "lastName": String,
    "userName": String,
    "email": String,
    "DOB": Date,
    "password": String

});

exports.schema = mongoose.model('members',mSchema);
