const express = require('express');
const router = express.Router();
const database = require('../db');

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
    for (let i = 0; i < database.places.length; i++) {
        if (req.params.placeName === database.places[i].placeName) {
            res.send(database.places[i]);
            break;
        }
    }
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
    for (let i = 0; i < database.places.length; i++) {
        if (req.params.placeName === database.places[i].placeName) {
            res.send(database.places[i]);
            break;
        }
    }
});

module.exports = router;