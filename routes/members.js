const express = require('express');
const router = express.Router();
const mongooseController = require('../controller/mongooseController');
const passport = require('passport');
const multer = require('multer');
var cloudinary = require('cloudinary').v2;
const cloudinaryConfig = require("../config/cloudinary");

// used to get current date to record when user is created
const moment = require('moment');

// Get all the model
let Member = require('../models/member');
let Rating = require('../models/rating');
let Event = require('../models/event');

// login as member
router.post('/authenticate', function (req, res, next) {
    // successful log in will launch the user's profile
    passport.authenticate('local', function (err, user) {
        if (err) return next(err);

        // reload again if user failed
        if (!user) return res.render('login', { error: 'Incorrect username or password' });
        if (!user.active) return res.render('login', { error: 'User is not active' });

        // load another page to set up profile if user is new
        req.logIn(user, function (err) {
            if (err) return next(err);

            if (user.firstTime) {
                return res.render('profileTags');
            } else {
                return res.redirect('/members/userProfile');
            }
        });
    })(req, res,next);
});

// easy access to user's own profile
router.get('/userProfile', function (req, res) {
    if (req.user === undefined)
        res.redirect('/');
    else {
        // load all ratings user made, events user created and joined onto profile page
        Rating.find({ userName: req.user.userName }, function (err, userRatings) {
            if (err) throw err;
            Event.find({ joinedUsers: req.user.userName }, function (err, eventsJoined) {
                if (err) throw err;
                Event.find({ organizer: req.user.userName }, function (err, eventsCreated) {
                    if (err) throw err;
                    res.render('profile', {
                        user: req.user,
                        rating: userRatings,
                        eventsJoined: eventsJoined,
                        eventsCreated: eventsCreated,
                        notCurr: false
                    });
                });
            });
        });
    }
});

// load profile of a certain user
router.get('/profile/:user', function (req, res) {
    if (req.user === undefined) {
        res.render('mustLogin');
    } else {
        if (req.params.user === req.user.userName) {
            return res.redirect('/members/userProfile');
        }
        // search user by username since it is unique
        var loginUser = {
            userName: req.params.user
        };
        Member.findOne(loginUser, function (err, result) {
            if (err) throw err;
            if (result) {
                // load all user reviews, events created and joined to user profile
                Rating.find({ userName: result.userName }, function (err, userRatings) {
                    if (err) throw err;
                    Event.find({ joinedUsers: result.userName }, function (err, eventsJoined) {
                        if (err) throw err;
                        Event.find({ organizer: result.userName }, function (err, eventsCreated) {
                            if (err) throw err;
                            res.render('profile', {
                                user: result,
                                rating: userRatings,
                                eventsCreated: eventsCreated,
                                eventsJoined: eventsJoined,
                                notCurr: (result.userName !== req.user.userName),
                                isFollowing: req.user.followedUsers.includes(result.userName)
                            });
                        });
                    });
                });
            } else {
                return res.render('notFound');
            }
        });
    }
});

// open login page, immediately go to profile page if logged in
router.get('/login', function (req, res) {
    if (req.user !== undefined)
        res.redirect('/members/userProfile/');
    else
        res.render('login');
});

// logout active user
router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

// open signup page
router.get('/signup', function (req, res) {
    res.render('signup');
});

// load page after verifying user email
router.get('/verify', function (req, res) {
    Member.findOneAndUpdate({ userName: req.query.user }, { $set: { active: true } }, function (err, user) {
        if (err) throw err;
        res.render('success');
    });
});

// setting up storage to upload media
var storage = multer.diskStorage({
    filename: function (req, file, cb) {
        cb(null, file.originalname + '-' + Date.now())
    }
});

var upload = multer({ storage: storage });

// registering a new user
router.post('/register', upload.single("display"), async function (req, res) {
    req.body.display= {
        public_id: '',
        url: req.file.filename
    };
    // check each element for validity, mostly check everything is filled
    req.checkBody('firstName', 'First name is required').notEmpty();
    req.checkBody('lastName', 'Last name is required').notEmpty();
    req.checkBody('userName', 'Username is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('DOB', 'Date of Birth is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('display', 'A display picture is required').notEmpty();

    var error = req.validationErrors();
    if (!error) {
        // check if password matches with retyped password
        req.checkBody('password_confirm', 'Password does not match').equals(req.body.password);
        error = req.validationErrors();
        if (!error) {
            // add join date of user, set format of user's name, fixed date format
            req.body['firstName'] = upperCaseName(req.body['firstName']);
            req.body['lastName'] = upperCaseName(req.body['lastName']);
            req.body['joined_date'] = moment().format('MMM Do YY');
            req.body['DOB'] = moment(req.body['DOB']).format('MMM Do YY');

            var reqURL;
            if (req.file !== undefined) {
                // upload user profile pic to cloudinary
                await cloudinary.uploader.upload(req.file.path,
                    function (error, result) {
                        if (error) throw error;
                        reqURL = {
                            public_id: result.public_id,
                            url: result.secure_url
                        }

                    });
            } else {
                // else load a default profile pic
                reqURL = {
                    public_id: '',
                    url: ''
                };
            }

            req.body['display'] = reqURL;
            // next phase, check if username and email exists in the database
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

// update user's interests, description, or profile pic
router.post('/updateUser', upload.single("display"), async function (req, res) {
    
    await Member.findOne({ userName: req.user.userName }, async function (err, result) {
        // if there is a new profile pic, remove old one in cloudinary database
        if (req.body.display) {
            var pic_delete_id = result.display.id
            if (pic_delete_id !== undefined) {
                await cloudinary.uploader.destroy(pic_delete_id, function (err, result) {
                    if (err) throw err;
                });
            }
        }
    });
    // upload new picture to cloudinary
    if(req.file !== undefined){
        await cloudinary.uploader.upload(req.file.path, function (error, result) {

            if (result.public_id === '') {
                req.body['display'] = {
                public_id: '',
                url: ''
                }; 
            }else {

            req.body['display'] = {
                public_id: result.public_id,
                url: result.secure_url
            };
        }
        // update display, interests, and description
        Member.findOneAndUpdate(
            { userName: req.user.userName }, {
                $set: {
                    'display': req.body.display,
                    'interests': req.body.interests,
                    'desc': req.body.desc
                }
            }, function (err, resp) {
                if (err) throw err;
                res.redirect('/members/userProfile');
            });

        });
    } else {
        // only update description and interests
        Member.findOneAndUpdate(
            { userName: req.user.userName }, {
                $set: {
                    'interests': req.body.interests,
                    'desc': req.body.desc
                }
            }, function (err, resp) {
                if (err) throw err;
                res.redirect('/members/userProfile');
            });

        }
});

// update password inside settings in profile page
router.put('/updatePassword', function (req, res) {
    // check if everything is filled and correct
    req.checkBody('password', 'Require password').notEmpty();
    req.checkBody('oldPwd', 'Old password does not match').equals(req.user.password);
    req.checkBody('retype', 'Does not match').equals(req.body.password);

    var error = req.validationErrors();

    if (!error) {
        Member.findOneAndUpdate({ userName: req.user.userName }, {
            $set: { 'password': req.body.password } }, function (err, result) {
            if (err) throw err;
            res.send(result);
        });
    } else {
        // do nothing
        res.send(null);
    }
});

// function to convert the first letter of the name to uppercase
function upperCaseName(name) {
    return name.charAt(0).toUpperCase() + name.slice(1);
}

// if user joined an event append the name (and maybe link) to the user's json
router.put('/addEvent/:userName', function (req, res) {
    Member.findOneAndUpdate({ userName: req.params.userName }, { $push: { joinedEvents : req.body.eventName} });
});

// update user with the description and list of interested tags
router.post('/storeInfo', function (req, res) {
    Member.findOneAndUpdate({ userName: req.user.userName }, { $set: { 'desc': req.body.description, 'interests': req.body.interests, 'firstTime': false } }, function (err, result) {
        res.redirect('/members/userProfile');
    });
});

// have current user follow another user
router.put('/followUser', function (req, res) {
    Member.findOneAndUpdate({ userName: req.user.userName }, {
        $push: { 'followedUsers': req.body.username }
    }, function (err, result) {
        res.send(result);
    });
});

// unfollow a user
router.put('/unfollowUser', function (req, res) {
    Member.findOneAndUpdate({ userName: req.user.userName }, {
        $pull: { 'followedUsers': req.body.username }
    }, function (err, result) {
        res.send(result);
    });
});

// have current user bookmark a place
router.put('/bookmark', function (req, res) {
    Member.findOneAndUpdate({ userName: req.user.userName }, {
        $push: { 'bookmark': req.body.name }
    }, function (err, result) {
        res.send(result);
    });
});

// stop bookmarking a place from member schema
router.put('/stopBookmark', function (req, res) {
    Member.findOneAndUpdate({ userName: req.user.userName }, {
        $pull: { 'bookmark': req.body.name }
    }, function (err, result) {
        res.send(result);
    });
});

// look up a user with the closest regex from the input
router.post('/searchUser', function (req, res) {
    // find the event
    Member.findOne({
        $or: [
            { userName: { $regex: req.body.username, $options: 'i' } },
            { firstName: { $regex: req.body.username, $options: 'i' } },
            { lastName: { $regex: req.body.username, $options: 'i' } }
        ]
    }, function (err, resp) {
        if (err) throw err;
        if (resp)
            res.redirect('/members/profile/' + resp.userName);
        else
            res.render('notFound');
    });
});

module.exports = router;
