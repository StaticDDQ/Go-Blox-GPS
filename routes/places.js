const express = require('express');
const router = express.Router();

// Get place model
let Place = require('../models/place');

// add places
router.post('/addPlace', function (req, res) {
    // save the places
    var addNewPlace = new Place(req.body);
    addNewPlace.save(function (err, places) {
        if (err) throw err;
        res.send(places);
    });
});

// get place
router.get('/getPlace/:placeName', function (req, res) {
    Place.findOne({ placeName: req.params.placeName }, function (err, resp) {
        if (err) throw err;
        res.send(resp);
    });
});

// update places
router.put('/updatePlace/:placeName', function (req, res) {
    Place.findOneAndUpdate(
        { placeName: req.params.placeName }, { $set: req.body }, function (err, resp) { //callback functions
            res.send(resp);
        });
});

// delete places
router.delete('/deletePlace/:placeName', function (req, res) {
    Place.findOneAndDelete(
        { placeName: req.params.placeName }, function (err, resp) {
            if (err) throw err;
            res.send(resp);
        }); 
});

module.exports = router;