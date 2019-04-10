var mongoose = require('mongoose');
const schema = require('./controller/schemaController');


var data = {
    username: "test",
    password: "testing123"
};

var options ={
    useNewUrlParser: true
};

var stringMongoose = "mongodb://"+data.username+":"+data.password+"@ds233806.mlab.com:33806/members_goblox";

mongoose.connect(stringMongoose, options)
    .catch((err) => console.log("ERORR:" + err));

var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", function (callback) {
    console.log("connection succeeded");
});

var Members = mongoose.model("members", schema);

function addUser(req) {
    var data = new Members({
        "firstName": req.body.firstName,
        "lastName": req.body.lastName,
        "DOB": req.body.DOB,
        "userName": req.body.userName,
        "password": req.body.password,
        "email": req.body.email
    });

    data.save(function (err, newMember) {
        if (!err) {
            res.send(newMember);
        } else {
            res.sendStatus(400);
        }
    })
}
