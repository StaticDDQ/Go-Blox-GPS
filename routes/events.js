// JavaScript source code
const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
var cloudinary = require('cloudinary').v2;
var NodeGeoCoder = require("node-geocoder");

// Get event model
let Event = require('../models/event');
let Places = require('../models/place');
let Rating = require('../models/rating');

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

// add event
router.post('/addEvent', upload.single("pictures"), async function (req, res) {

    // check each element for validity
    req.checkBody('name', 'Event name is required').notEmpty();
    req.checkBody('address', 'Address is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('description', 'Description is required').notEmpty();
    req.checkBody('phone', 'Phone number is required').notEmpty();
    req.checkBody('pictures','Photo required').notEmpty();
    

    // get geo code
    geocoder.geocode(req.body.address, function(err,resp){
        if(resp.length <1) throw Error("No location found");
        req.body.location = resp[0];
    });

    var error = req.validationErrors();
    if (!error) {

        req.checkBody('tags', 'Require atleast 1 tag').notEmpty();
        error = req.validationErrors();

        if (!error) {
            var checkEventExists = await lookUpEvent(req.body.name);

            if (!checkEventExists) {
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
                addNewEvent['organizer'] = req.user.userName;
                addNewEvent.save(function (err, event) {
                    if (err) throw err;

                    return res.redirect('/events/getEvent/' + event._id.toString());
                });
            }
        } else {
            res.render('createEvent', { errors: 'Require atleast 1 tag' });
        }

    } else {
        res.render('createEvent', { errors: 'Incorrect event creation' });
    }
});

async function lookUpEvent(eventName) {
    var found = null;
    found = await Event.findOne({ name: eventName });
    return found;
}

// if want to search
router.post('/maps/search', async function(req,res){
    var arrayed = [];
    await Event.find({
        $or: [
            {name: {$regex: req.body.search, $options: 'i' }},
            {email: {$regex: req.body.search, $options: 'i' }},
            {organizers: {$regex: req.body.search, $options: 'i' }},
            {address: {$regex: req.body.search, $options: 'i' }}
        ] }, function (err, resp) {

        for (let i = 0; i < resp.length; i++){
            var aEvent = {
                name: resp[i].name,
                lat: parseFloat(resp[i].location[0].latitude),
                long: parseFloat(resp[i].location[0].longitude),
                address: resp[i].address,
                phone: resp[i].phone,
                email: resp[i].email
            };
        

            arrayed.push(aEvent);
        };

    });
    await Places.find({
        $or: [
            {placeName: {$regex: req.body.search, $options: 'i' }},
            {placeDescription: {$regex: req.body.search, $options: 'i' }},
            {placeAddress: {$regex: req.body.search, $options: 'i' }}
        ] }, function (err, resp) {
        if (err) throw err;
        for (let i = 0; i < resp.length; i++){
            var aPlaces = {
                name: resp[i].placeName,
                lat: parseFloat(resp[i].location[0].latitude),
                long: parseFloat(resp[i].location[0].longitude),
                address: resp[i].placeAddress,
                phone: resp[i].placePhone,
                email: ''
            };

            arrayed.push(aPlaces);
        };
    
    });
    await console.log(arrayed);
    await res.render('maps', {events: arrayed});

});

//change back to post
router.get('/createEvent', function (req, res) {
    if (req.user === undefined)
        res.redirect('/');
    else
        res.render('createEvent');
});

// get event
router.get('/getEvent/:id', function (req, res) {
    Event.findById(req.params.id, function (err, event) {
        if (err) throw err;
        if (event != null) {
            Rating.find({ eventID: req.params.id }, function (err, result) {
                if (err) throw err;

                if (req.user !== undefined && event.organizer === req.user.userName)
                    res.render('ownerEventDetails', { event: event, ratings: result });
                else
                    res.render('eventDetails', {
                        event: event,
                        ratings: result
                    });
            });
        } else {
            res.render('notFound');
        }
    })
});

router.get('/findEvent', function (req, res) {
    if (req.user === undefined) {
        res.redirect('/');
    } else {
        res.render('loadEventsFirst');
    }
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

// add a user to the joinedUsers array of an event
router.put('/joinEvent', function (req, res) {
    if (req.user === undefined) {
        res.error();
    } else {
        Event.findById(req.body.id, function (err, result) {
            if (!result.joinedUsers.includes(req.user.userName)) {
                result.joinedUsers.push(req.user.userName);
                result.save(function (err) {
                    if (err) throw err;
                });
            }
            res.send(result);
        });
    }
});

// remove user from the joinedUsers array of an event
router.put('/declineEvent', function (req, res) {
    if (req.user === undefined) {
        res.error();
    } else {
        Event.findByIdAndUpdate(req.body.id, { $pull: { 'joinedUsers': req.user.userName } }, function (err, result) {
            if (err) throw err;
            res.send(result);
        });
    }
});

// Get name of event after looking up the ID
router.post('/getEventById', function (req, res) {

    Event.findById(req.body.id, function (err, result) {
        if (err) throw err;
        if (result) res.send(result.name);
    });
});

module.exports = router;
