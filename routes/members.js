const express = require('express');
const router = express.Router();
const mongooseController = require('../controller/mongooseController');
const passport = require('passport');

// used to get current date to record when user is created
const moment = require('moment');

// Get member model
let Member = require('../models/member');

// login as member
router.post('/authenticate', function (req, res, next) {
    // successful log in will launch the user's profile
    passport.authenticate('local', function (err, user, info) {
        if (err) return next(err);
        if (!user) return res.render('login', { error: 'Incorrect username or password' });
        if (!user.active) return res.render('login', { error: 'User is not active' });

        req.logIn(user, function (err) {
            if (err) return next(err);
            
            if (user.firstTime) {
                return res.render('profileTags');
            } else
                return res.redirect('/members/profile/' + user.userName);
        });
    })(req, res,next);
});

// load profile
router.get('/profile/:user', function (req, res) {
    if (req.user === undefined) {
        res.end();
    } else {
        var loginUser = {
            userName: req.params.user
        };
        Member.findOne(loginUser, function (err, result) {
            if (err) throw err;
            if (result) {
                res.render('profile', { user: result });
            }
        });
    }
});

router.get('/login', function (req, res) {
    res.render('login');
});

// logout active user
router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

// get member (get from mockup database)
router.get('/getFirstname/:firstname', function (req, res) {
    Member.findOne({ firstName: req.params.firstname }, function (err, resp) {
        if (err) throw err;
        res.send(resp);
    });
});

router.get('/signup', function (req, res) {
    res.render('signup');
});

router.get('/verify', function (req, res) {
    Member.findOneAndUpdate({ userName: req.query.user }, { $set: { active: true } }, function (err, user) {
        if (err) throw err;
        res.render('success');
    });
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

    var error = req.validationErrors();
    if (!error) {
        req.checkBody('password_confirm', 'Password does not match').equals(req.body.password);
        error = req.validationErrors();
        if (!error) {
            // add join date of user
            req.body['firstTime'] = true;
            req.body['firstName'] = upperCaseName(req.body['firstName']);
            req.body['lastName'] = upperCaseName(req.body['lastName']);
            req.body['joined_date'] = moment().format('MMM Do YY');
            req.body['DOB'] = moment(req.body['DOB']).format('MMM Do YY');
            req.body['active'] = false;

            mongooseController.addUser(req, res);
        } else {
            res.render('signup', {
                error: 'Password does not match.'
            });
        }
    } else {
        res.render('signup', {
            error: 'Incorrect signup.' 
        });
    }
});

function upperCaseName(name) {
    return name.charAt(0).toUpperCase() + name.slice(1);
}

// update member
router.put('/updatePassword', function (req, res) {

    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('retype', 'Password does not match').equals(req.body.password);
    req.checkBody('oldPwd', 'Old password does not match').equals(req.user.password);
    var error = req.validationErrors();
    if (!error) {
        Member.findOneAndUpdate(
            { userName: req.user.userName }, { $set: { 'password': req.body.password } }, function (err, resp) {
                if (err) throw err;
                res.send(resp);
            });
    } else {
        res.send(null);
    }
});

// if user joined an event append the name (and maybe link) to the user's json
router.put('/addEvent/:userName', function (req, res) {
    Member.findOneAndUpdate({ userName: req.params.userName }, { $push: { joinedEvents : req.body.eventName} });
});

// delete member
router.delete('/deleteMember/:username', function (req, res) {

    Member.findOneAndDelete(
        { userName: req.params.username }, function (err, resp) {
            if (err) throw err;
            res.send(resp);
        }); 
});

// indicate whether a user is interested in a event
router.put('/interested', function (req, res) {
    if (req.user === undefined) {
        res.error();
    } else {
        Member.findOneAndUpdate({ userName: req.user.userName }, { $push: { 'joinedEvents': req.body.eventID } }, function (err, res) {
            console.log(res);
        });
    } 
});

// indicate whether a user is interested in a event
router.put('/notInterested', function (req, res) {
    if (req.user === undefined) {
        res.error();
    } else {
        Member.findOneAndUpdate({ userName: req.user.userName }, { $pull: { 'joinedEvents': req.body.eventID } }, function (err, res) {
            console.log(res);
        });
    }
});

// update user with the description and list of interested tags
router.post('/storeInfo', function (req, res) {
    Member.findOneAndUpdate({ userName: req.user.userName }, { $set: { 'desc': req.body.description, 'interests': req.body.interest, 'firstTime': false } }, function (err, res) {
        console.log(res);
    });
    res.redirect('/members/profile/' + req.user.userName);
});

module.exports = router;
