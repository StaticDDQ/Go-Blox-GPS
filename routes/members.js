const express = require('express');
const path = require('path');
const router = express.Router();
const database = require('../db');
const mongooseController = require('../controller/mongooseController');
const passport = require('passport');

// used to get current date to record when user is created
const moment = require('moment');

// Get member model
let Member = require('../models/member');

var currentLogin = database.members[0];

// login as member
router.post('/login', function (req, res, next) {
    // successful log in will launch the user's profile
    passport.authenticate('local', {
        successRedirect: '/members/profile',
        failureRedirect: '/members/failedLogin'
    })(req, res,next);
    currentLogin = req.body;
});

// load profile
router.get('/profile', function (req, res) {
    var loginUser = {
        userName: currentLogin.username
    };
    Member.findOne(loginUser, function(err, result){
        if(err) throw err;
        res.render('../public/views/profile.pug', result);
    });

});

// load error
router.get('/failedLogin', function (req, res) {
    res.sendFile(path.join(__dirname + '/../public/failedLogin.html'));

});

// logout active user
router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

// get member (get from mockup database)
router.get('/getFirstname/:firstname', function (req, res) {
    for (let i = 0; i < database.members.length; i++) {
        if (req.params.firstname === database.members[i].firstName) {
            res.send(database.members[i]);
            break;
        }
    }
});

// register as member
router.post('/register', function (req, res) {

    // check each element for validity
    req.checkBody('firstName', 'First name is required').notEmpty();
    req.checkBody('lastName', 'Last name is required').notEmpty();
    req.checkBody('userName', 'Username is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('DOB', 'Date of Birth is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password_confirm', 'Password does not match').equals(req.body.password);

    var error = req.validationErrors();
    if (!error) {
        // add join date of user
        req.body['joined_date'] = moment().format('YYYY-MM-DD');

        mongooseController.addUser(req, res);
    } else {
        res.sendFile(path.join(__dirname + '/../public/failedRegister.html'));
    }
});

// update member
router.put('/updateMember/:userName', function (req, res) {
    Member.findOneAndUpdate(
        { userName: req.params.userName }, { $set: req.body }, function (err, resp) {
            res.send(resp);
        });
})

// delete member
router.delete('/deleteMember/:username', function (req, res) {
    for (let i = 0; i < database.events.length; i++) {
        if (req.params.username === database.members[i].userName) {
            res.send(database.members[i]);
            database.members.splice(i);
            break;
        }
    }
});

module.exports = router;
