const mongoose = require('mongoose');

// member schema
const memberSchema = new mongoose.Schema({
    "firstName": String,
    "lastName": String,
    "userName": {
        type: String,
        required: true,
        unique: true
    },
    "email": String,
    "DOB": Date,
    "joined_date": Date,
    "password": String
}, { versionKey: false });

const Member = module.exports = mongoose.model('members', memberSchema);