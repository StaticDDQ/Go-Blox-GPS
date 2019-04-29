const express = require('express');
const router = express.Router();
const mongooseController = require('../controller/mongooseController');
const passport = require('passport');

// used to get current date to record when user is created
const moment = require('moment');

// Get member model
let Member = require('../models/member');

var currentLogin;

// login as member
router.post('/authenticate', function (req, res, next) {
    // successful log in will launch the user's profile
    passport.authenticate('local', function (err, user, info) {
        if (err) return next(err);
        if (!user) return res.render('login', { error: 'Incorrect username or password' });

        req.logIn(user, function (err) {
            if (err) return next(err);
            currentLogin = req.body;
            return res.redirect('/members/profile');
        });
    })(req, res,next);
});

// load profile
router.get('/profile', function (req, res) {
    var loginUser = {
        userName: currentLogin.username
    };
    Member.findOne(loginUser, function(err, result){
        if(err) throw err;
        res.render('profile', result);
    });

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
            req.body['joined_date'] = moment().format('YYYY-MM-DD');

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

// update member
router.put('/updateMember/:userName', function (req, res) {
    Member.findOneAndUpdate(
        { userName: req.params.userName }, { $set: req.body }, function (err, resp) {
            if (err) throw err;
            res.send(resp);
        });
});

// if user joined an event append the name (and maybe link) to the user's json
router.put('/addEvent/:userName', function (req, res) {
    var user = Member.findone({ userName: req.params.userName });
    var obj = JSON.parse(user);
    obj['joinedEvents'].push(req.body.tag);
    jsonStr = JSON.stringify(obj);
    Member.findOneAndUpdate(
        { username: req.params.userName }, { $set: jsonStr });
});

// delete member
router.delete('/deleteMember/:username', function (req, res) {

    Member.findOneAndDelete(
        { userName: req.params.username }, function (err, resp) {
            if (err) throw err;
            res.send(resp);
        }); 
});

module.exports = router;
