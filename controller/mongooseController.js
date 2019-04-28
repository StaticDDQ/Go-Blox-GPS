let Members = require('../models/member');

// add user asynchronously if the username does not exists in mongoDB
var addUser = async function(req, res) {

    var dupliUser = await findUser(req.body.userName);

    // will not add if same username exists
    if (!dupliUser) {
        var data = new Members({
            "firstName": req.body.firstName,
            "lastName": req.body.lastName,
            "userName": req.body.userName,
            "email": req.body.email,
            "DOB": req.body.DOB,
            "password": req.body.password,
            "joined_date": req.body.joined_date
        });

        data.save(function (err, newMember) {
            if (!err) {
                res.send(newMember);
            } else {
                throw err;
            }
        });
    } else {
        console.log("Duplicated user");
    }
}

// look if username exists in mongoDB
async function findUser(username) {
    var found = null;
    found = await Members.findOne({ userName: username });
    return found;
}

module.exports.addUser = addUser;
