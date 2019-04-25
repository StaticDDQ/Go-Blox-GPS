let Members = require('../models/member');

var addUser = async function(req, res) {

    var dupliUser = await findUser(req.body.userName);

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

async function findUser(username) {
    var found = null;
    found = await Members.findOne({ userName: username });
    return found;
}

module.exports.addUser = addUser;
