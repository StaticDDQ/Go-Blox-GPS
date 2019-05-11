const express = require('express');
const router = express.Router();
const moment = require('moment')

// Get rating model to save collection
let Rating = require('../models/rating');

// give rating
router.post('/addRating', function (req, res) {
    // save the rating
    var addNewRating = new Rating({
        eventID: req.body.eventID,
        stars: req.body.stars,
        desc: req.body.desc,
        userName: "tester",
        datePublished: moment().format('YYYY-MM-DD')
    });

    addNewRating.save(function (err, ratings) {
        if (err) throw err;
        res.send(ratings);
    });
});

// get rating based on event ID
router.get('/getRating/:eventID', function (req, res) {
    Rating.findOne({ eventID: req.params.eventID }, function (err, resp) {
        if (err) throw err;
        res.send(resp);
    });
});

module.exports = router;