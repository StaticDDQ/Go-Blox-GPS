const express = require('express');
const router = express.Router();
const moment = require('moment')

// Get rating model to save collection
let Rating = require('../models/rating');

// give rating to an event
router.put('/addRating', function (req, res) {
    // save the rating and give date timestamp
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

// happens in profile, delete rating will delete comment from that event
router.delete('/deleteRating/:id', function (req, res) {

    Rating.findByIdAndDelete(req.params.id, function (err, result) {
        if (err) throw err;
        res.send(result);
    });
})

module.exports = router;