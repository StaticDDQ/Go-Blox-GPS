// JavaScript source code
const express = require('express');
const router = express.Router();
const database = require('../db');

// Bring in User Model
let Rating = require('../models/review');

// give rating
router.post('/addRating', function (req, res) {
    // save the rating
    var addNewRating = new Rating(req.body);
    addNewRating.save(function (err, ratings) {
        if (err) throw err;
        res.send(ratings);
    });
});

// get rating
router.get('/getRating/:eventID', function (req, res) {
    for (let i = 0; i < database.ratings.length; i++) {
        if ((Number)(req.params.eventID) === database.ratings[i].eventID) {
            res.send(database.ratings[i]);
            break;
        }
    }
});

module.exports = router;