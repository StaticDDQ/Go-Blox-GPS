const mongoose = require('mongoose');
//const schema = require('./schemaController');
const MongoClient = require('mongodb').MongoClient;

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
    "DateTime": Date
});

// events schema
var eventsSchema = new mongoose.Schema({
   "name": String,
   "date": Date,
   "address": String,
   "description": String,
   "contact": String,
   "pictures": String,
   "tags": String 
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

MongoClient.connect(stringMongoose, function (err, db) {
    if (err) throw err;

    var dbo = db.db("members_goblox");
    dbo.collection("members").findOne({}, function (err, result) {
        if (err) throw err;
        db.close();
    });
});

var addUser = function(req, res) {

    //console.log(req.body);
    var data = new Members(req.body);

    data.save(function (err, newMember) {
        if (!err) {
            
            //console.log(Members.find());
            res.send(newMember);
        } else {
            console.log("error saving");
            res.sendStatus(400);
        }
    })
}

module.exports.Members = Members;
