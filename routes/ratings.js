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
        userName: req.user.userName,
        eventName: req.body.eventName,
        datePublished: moment().format('MMM Do YY')
    });

    addNewRating.save(function (err, ratings) {
        if (err) throw err;
        res.send(ratings);
    });
});

module.exports = router;