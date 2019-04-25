// JavaScript source code
const express = require('express');
const router = express.Router();
const database = require('../db');
const mongooseController = require('../controller/mongooseController');
const bcrypt = require('bcryptjs');
const passport = require('passport');

// Bring in User Model
let Member = require('../models/member');

// login as member
router.get('/login', function (req, res) {
    Member.findOne(
        {
            username: req.params.userName,
            password: req.params.password
        }, { $set: req.body }, function (err, resp) {
            res.send(resp);
        }
    )
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