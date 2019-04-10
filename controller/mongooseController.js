const mongoose = require('mongoose');
//const schema = require('./schemaController');
const MongoClient = require('mongodb').MongoClient;

var schema = new mongoose.Schema({
    "firstName": String,
    "lastName": String,
    "userName": String,
    "email": String,
    "DOB": Date,
    "password": String
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

var Members = mongoose.model("members", schema);

MongoClient.connect(stringMongoose, function (err, db) {
    if (err) throw err;

    var dbo = db.db("members_goblox");
    dbo.collection("members").findOne({}, function (err, result) {
        if (err) throw err;
        console.log(result);
        db.close();
    });
});

exports.addUser = (req, res) => {

    //console.log(req.body);
    var data = new Members({
        "firstName": req.body.firstName,
        "lastName": req.body.lastName,
        "DOB": req.body.DOB,
        "userName": req.body.userName,
        "password": req.body.password,
        "email": req.body.email
    });
    console.log(data.firstName);

    data.save(function (err, newMember) {
        if (!err) {
            
            //console.log(Members.find());
            res.send(newMember);
        } else {
            res.sendStatus(400);
        }
    })
}
