const express = require('express');
const router = express.Router();

// Get rating model to save collection
let Rating = require('../models/rating');

// give rating
router.post('/addRating', function (req, res) {
    // save the rating
    var addNewRating = new Rating(req.body);
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