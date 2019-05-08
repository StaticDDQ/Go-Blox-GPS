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

router.get('/maps', function(req,res){
    const leaf = require("leaflet");
    var mymap = l.map('mapid').setView([51.505, -0.09], 13);
    leaf.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'your.mapbox.access.token'
}).addTo(mymap);
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