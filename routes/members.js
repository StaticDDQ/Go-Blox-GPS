// JavaScript source code
const express = require('express');
const router = express.Router();
const database = require('../db');
const mongooseController = require('../controller/mongooseController');
const passport = require('passport');

// Bring in User Model
let Member = require('../models/member');

// login as member
router.post('/login', function (req, res, next) {
    
    passport.authenticate('local', {
        successRedirect: '/members/getFirstname/Clay',
        failureRedirect: '/members/getFirstname/Lang'
    })(req, res, next);
});

router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
})

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

    req.checkBody('firstName', 'First name is required').notEmpty();
    req.checkBody('lastName', 'Last name is required').notEmpty();
    req.checkBody('userName', 'Username is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('DOB', 'Date of Birth is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('firstName', 'First name is required').notEmpty();
    req.checkBody('confirm', 'Password does not match').equals(req.body.password);

    mongooseController.addUser(req, res);
})

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