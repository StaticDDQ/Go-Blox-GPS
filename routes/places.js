// JavaScript source code
const express = require('express');
const router = express.Router();
const multer = require('multer');
var cloudinary = require('cloudinary').v2;
var NodeGeoCoder = require("node-geocoder");

// Get place model
let Place = require('../models/place');

// to show to get long and lat
var options = {
    provider: 'openstreetmap'
};
var geocoder = NodeGeoCoder(options);

// setting up storage to upload media
var storage = multer.diskStorage({
    filename: function (req, file, cb) {
        cb(null, file.originalname + '-' + Date.now())
    }
});

var upload = multer({ storage: storage })

// add places
router.post('/addPlace', upload.single("pictures"), async function (req, res) {
    // check each element for validity
    req.checkBody('placeName', 'Place name is required').notEmpty();
    req.checkBody('placeAddress', 'Address is required').notEmpty();
    req.checkBody('placePhone', 'Phone number is required').notEmpty();
    req.checkBody('placeDescription', 'Description is required').notEmpty();

    // get geo code
    geocoder.geocode(req.body.placeAddress, function(err,resp){
        req.body.location = resp[0];
    });

    var error = req.validationErrors();
    if (!error) {
        req.checkBody('category', 'Require atleast 1 tag').notEmpty();
        error = req.validationErrors();

        if (!error) {
            var reqURL;
            // upload picture to cloudinary database
            await cloudinary.uploader.upload(req.file.path,
                {
                    eager: [
                        { width: 0.5, crop: "scale" }]
                },
                function (error, result) {
                    if (error) throw error;

                    reqURL = result.secure_url;

                });
            // add picture to place JSON and save it
            req.body.pictures = reqURL;
            var addNewPlace = new Place(req.body);
            addNewPlace.save(function (err, place) {
                if (err) throw err;
                res.render('placeDetails', { place: place });
            });
        } else {
            res.render('createPlace', { errors: 'Require a category' });
        }
        // reload while giving error message
    } else {
        res.render('createPlace', { errors: 'Incorrect place creation' });
    }
});

// load create place page if logged in
router.get('/createPlace', function (req, res) {
    if (req.user === undefined)
        res.redirect('/');
    else
        res.render('createPlace');
});

// get place by id
router.get('/getPlace/:id', function (req, res) {
    Place.findById(req.params.id, function (err, place) {
        if (err) throw err;
        if (place != null) {
            // get location data to display place in map
            place['lat'] = parseFloat(place.location[0].latitude);
            place['long'] = parseFloat(place.location[0].longitude);
            // check if place is bookmarked or not
            res.render('placeDetails', {
                place: place,
                isBookmarked: req.user !== undefined && req.user.bookmark.includes(place.placeName)
            });
        } else {
            res.render('notFound');
        }
    })
});

// get places by by checking keywords with the name or address
router.post('/getPlaces', function (req, res) {
    if (req.user !== undefined) {
        Place.find({
            $or: [
                { placeName: { $regex: req.body.name, $options: 'i' } },
                { placeAddress: { $regex: req.body.name, $options: 'i' } }
            ]
        }, function (err, resp) {
            if (err) throw err;
            var placeArr = [];
            // get all place data to be displayed onto the map
            for (let i = 0; i < resp.length; i++) {
                var aPlaces = {
                    id: resp[i]._id,
                    placeName: resp[i].placeName,
                    lat: parseFloat(resp[i].location[0].latitude),
                    long: parseFloat(resp[i].location[0].longitude),
                    placeAddress: resp[i].placeAddress,
                    phone: resp[i].placePhone,
                    pictures: resp[i].pictures,
                    placeDescription: resp[i].placeDescription,
                    category: resp[i].category
                };

                placeArr.push(aPlaces);
            };
            res.render('loadPlaces', { places: placeArr, isLoggedIn: req.user !== undefined });
        });
    }
    else {
        res.render('mustLogin');
    }
});

// get place by category if logged in
router.post('/getPlacesByCategory/', function (req, res) {
    if (req.user !== undefined) {
        // find the place
        Place.find({
            category: req.body.category
        }, function (err, resp) {
            if (err) throw err;
            res.render('loadPlaces', { places: resp, isLoggedIn: req.user !== undefined });
        });
    }
    else {
        res.render('mustLogin');
    }
});

module.exports = router;