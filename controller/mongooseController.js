const mongoose = require('mongoose');
const MongoClient = require('mongodb').MongoClient;
const Promise = require('bluebird');
var url = "mongodb://localhost:3000/";

// member schema
var memberSchema = new mongoose.Schema({
    "firstName": String,
    "lastName": String,
    "userName": {
        type: String,
        required: true,
        unique: true
    },
    "email": String,
    "DOB": Date,
    "password": String
}, { versionKey: false });

// review schema
var reviewSchema = new mongoose.Schema({
    "eventID": Number,
    "stars": Number,
    "desc": String,
    "userName": String,
    "datePublished": Date
});

// events schema
var eventsSchema = new mongoose.Schema({
   "name": String,
   "date": Date,
   "address": String,
   "description": String,
   "contact": String,
   "pictures": String,
   "tags": [String] 
});

// places schema
var placeSchema = new mongoose.Schema({
    "placeName": String,
    "placeAddress": String,
    "placeDescription": String,
    "placePhone": String,
    "placeTags": String
 });


var data = {
    username: "test",
    password: "testing123"
};

var options = {
    useNewUrlParser: true
};

var stringMongoose = "mongodb://" + data.username + ":" + data.password + "@ds233806.mlab.com:33806/members_goblox";

mongoose.connect(stringMongoose, options)
    .catch((err) => console.log("ERORR:" + err));

var Members = mongoose.model("members", memberSchema);
var Events = mongoose.model("events", eventsSchema);
var Places = mongoose.model("places", placeSchema);
var Ratings = mongoose.model("ratings",reviewSchema);

var addUser = async function(req, res) {

    var dupliUser = await findDuplicate(req.body.userName);

    if (!dupliUser) {
        var data = new Members(req.body);

        data.save(function (err, newMember) {
            if (!err) {
                res.send(newMember);
            } else {
                console.log("error saving");
                res.sendStatus(400);
            }
        });
    } else {
        console.log("Duplicated user");
    }
}

async function findDuplicate(username) {
    var found = null;
    found = await Members.findOne({ userName: username });
    return found;
}

module.exports = {Members,Events,Places,Ratings};
module.exports.addUser = addUser;

