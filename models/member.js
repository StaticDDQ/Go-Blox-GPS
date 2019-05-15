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
    "DOB": String,
    "joined_date": String,
    "password": String,
    "joinedEvents": [String],
    "active": Boolean,
    "display": String,
    "desc": String,
    "interests": [String],
    "firstTime": Boolean,
    "followedUsers": [String]
}, { versionKey: false});

const Member = module.exports = mongoose.model('members', memberSchema);