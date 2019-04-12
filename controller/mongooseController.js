const mongoose = require('mongoose');

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

// places schema
var placeSchema = new mongoose.Schema({
    "placeName": Number,
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
module.exports.addUser = addUser;
module.exports = {memberSchema,reviewSchema,eventsSchema,placeSchema};

