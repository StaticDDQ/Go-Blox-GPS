// JavaScript source code
const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
var cloudinary = require('cloudinary').v2;
var cloudConfig = require("../config/cloudinary");
var NodeGeoCoder = require("node-geocoder");

// to show to get long and lat
var options = {
    provider: 'openstreetmap'
};
var geocoder = NodeGeoCoder(options);

// Get event model
let Event = require('../models/event');

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
  })
   
var upload = multer({ storage: storage })

// add event
router.post('/addEvent', upload.single("pictures"), async function (req, res) {

    // check each element for validity
    req.checkBody('name', 'Event name is required').notEmpty();
    req.checkBody('organizer', 'Organizer is required').notEmpty();
    req.checkBody('address', 'Address is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('description', 'Description is required').notEmpty();
    req.checkBody('phone', 'Phone number is required').notEmpty();

    // get geo code
    geocoder.geocode(req.body.address, function(err,resp){
        req.body.location = resp;
    });



    var error = req.validationErrors();
    if (!error) {
        req.checkBody('tags', 'Require atleast 1 tag').notEmpty();
        error = req.validationErrors();

        if (!error) {
            var reqURL;
            
            await cloudinary.uploader.upload(req.file.path,
                {
                    eager: [
                        { width: 0.5, crop: "scale" }]
                },
                function (error, result) {
                    if (error) throw error;

                    reqURL = result.secure_url;

                });
            req.body.pictures = reqURL;
            var addNewEvent = new Event(req.body);
            addNewEvent.save(function (err, event) {
                if (err) throw err;
                res.send(event);
            });
        } else {
            res.render('createEvent', { errors: 'Require atleast 1 tag' });
        }
        
    } else {
        res.render('createEvent', { errors: 'Incorrect event creation' });
    }
});

router.get('/maps', function(req,res){
    Event.findOne({name: "Photo Photo"}, function(err, resp){
        if(err) throw err;
        var result = {
            name: resp.address,
            long: resp.location[0].longitude,
            lat: resp.location[0].latitude
        };
        console.log(result);
        res.render('maps', result);
    })
});

router.get('/createEvent', function (req, res) {
    res.render('createEvent');
});

// get event
router.get('/getEvent/:name', function (req, res) {
    Event.findOne({name: req.params.name}, function(err, event){
        if(err) throw err;
        res.render('eventDetails', event);
    })
});

router.get('/findEvent', function (req, res) {
    res.render('loadEventsFirst');
})

// get events by name
router.post('/getEvents', function (req, res) {
    // find the event
    Event.find({ 
        $or: [
            {name: {$regex: req.body.name, $options: 'i' }},
            {email: {$regex: req.body.name, $options: 'i' }},
            {organizers: {$regex: req.body.name, $options: 'i' }}
        ] }, function (err, resp) {
        if (err) throw err;
        res.render('loadEvents', { events : resp});
    });
});

// update event
router.put('/updateEvent/:name', function (req, res) {
    Event.findOneAndUpdate(
        { name: req.params.name }, { $set: req.body }, function (err, resp) { //callback functions
            res.send(resp);
        });
});

// if user joined an event append the name (and maybe link) to the user's json
router.put('/addUser/:name', function (req, res) {
    var event = Event.findone({ name: req.params.name });
    var obj = JSON.parse(event);
    obj['joinedUsers'].push(req.body.username);
    jsonStr = JSON.stringify(obj);
    Event.findOneAndUpdate(
        { name: req.params.name }, { $set: jsonStr });
});

// delete event
router.delete('/deleteEvent/:name', function (req, res) {
    Event.findOneAndDelete({ name: req.params.name }, function (err, resp) {
        if (err) throw err;
        res.send(resp);
    })
});

// map event
router.get('/getMap', function (req, res){
    res.sendFile(path.join(__dirname, '../public/map.html'));
});

module.exports = router;
