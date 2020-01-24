const Members = require('../models/member');

// add user asynchronously if the username does not exists in mongoDB
var addUser = async function(req, res) {

    var dupliUser = await findUser(req.body.userName);

    // will not add if same username or/and emial exists
    if (!dupliUser) {
        dupliUser = await findEmail(req.body.email);
        if (!dupliUser) {
            var data = new Members({
                "firstName": req.body.firstName,
                "lastName": req.body.lastName,
                "userName": req.body.userName,
                "email": req.body.email,
                "DOB": req.body.DOB,
                "password": req.body.password,
                "joined_date": req.body.joined_date,
                "firstTime": true,
                "desc": "",
                "interests": [],
                "display": req.body.display,
                "followedUsers": req.body.followedUsers,
                "interestedEvents": [],
                "bookmark": []
            });

            // save user to db and send an email
            data.save(function (err, newMember) {
                if (!err) {

                    // reload page, asking user to verify email
                    res.render('login');
                } else {
                    throw err;
                }
            });
        } else {
            res.render('signup', {
                error: 'Email already existed'
            });
        }
        
    } else {
        res.render('signup', {
            error: 'Username already existed'
        });
    }
}

// look if username exists in mongoDB
async function findUser(username) {
    var found = null;
    found = await Members.findOne({ userName: username });
    return found;
}

// look if username exists in mongoDB
async function findEmail(email) {
    var found = null;
    found = await Members.findOne({ email: email });
    return found;
}

module.exports.addUser = addUser;
