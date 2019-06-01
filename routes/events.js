// JavaScript source code
const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
var cloudinary = require('cloudinary').v2;
var NodeGeoCoder = require("node-geocoder");
const limiter = require('express-rate-limit');

// Get event model
let Event = require('../models/event');
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

// to set up limit for how many events to be made in a day
const createEventLimiter = limiter({
    windowMs: 24 * 60 * 60 * 1000, // 24 hour window
    max: 2, // start blocking after 2 requests
  });

// add event
router.post('/addEvent', upload.single("pictures"), createEventLimiter, async function (req, res) {
    req.body.pictures = req.file.filename;
    console.log(req.body);
    // check each element for validity
    req.checkBody('name', 'Event name is required').notEmpty();
    req.checkBody('address', 'Address is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('description', 'Description is required').notEmpty();
    req.checkBody('pictures','Photo required').notEmpty();

    // get geo code
    geocoder.geocode(req.body.address, function(err,resp){
        if(resp.length <1) throw Error("No location found");
        req.body.location = resp[0];
    });

    var error = req.validationErrors();
    if (!error) {
        // events must have atleast 1 tag
        req.checkBody('tags', 'Require atleast 1 tag').notEmpty();
        error = req.validationErrors();

        if (!error) {

            var reqURL;
            // upload event pic to cloudinary
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
            // load event page after creation
            addNewEvent.save(function (err, event) {
                if (err) throw err;

                return res.redirect('/events/getEvent/' + event._id.toString());
            });
            
        } else {
            res.render('createEvent', { errors: 'Require atleast 1 tag' });
        }

    } else {
        res.render('createEvent', { errors: 'Incorrect event creation' });
    }
});

//load create event page
router.get('/createEvent', function (req, res) {
    if (req.user === undefined)
        res.redirect('/');
    else
        res.render('createEvent');
});

// get event by id
router.get('/getEvent/:id', function (req, res) {
    Event.findById(req.params.id, function (err, event) {
        if (err) throw err;
        if (event != null) {
            // load all reviews of this event
            Rating.find({ eventID: req.params.id }, function (err, result) {
                if (err) throw err;

                // load different page if event belongs to the user
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

// load find event page and get all event data in the db
router.get('/findEvent', function (req, res) {
    // if user is logged in
    if (req.user === undefined) {
        res.redirect('/');
    } else {
        Event.find({}).exec(function(err, resp){
            if(err) throw err;
            var arrayed = [];
            for (let i = 0; i < resp.length; i++){
                var aEvent = {
                    id: resp[i]._id,
                    name: resp[i].name,
                    lat: parseFloat(resp[i].location[0].latitude),
                    long: parseFloat(resp[i].location[0].longitude),
                    address: resp[i].address,
                    phone: resp[i].phone,
                    email: resp[i].email,
                    pictures: resp[i].pictures
                };
    
                arrayed.push(aEvent);      
            }
            
            res.render('loadEventsFirst', { events: arrayed, isLoggedIn: req.user !== undefined });
        });
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
        var arrayed = [];
        // get required data to load events to the map
        for (let i = 0; i < resp.length; i++){
            var aEvent = {
                id: resp[i].id,
                name: resp[i].name,
                lat: parseFloat(resp[i].location[0].latitude),
                long: parseFloat(resp[i].location[0].longitude),
                address: resp[i].address,
                phone: resp[i].phone,
                email: resp[i].email,
                startDate: resp[i].startDate,
                endDate: resp[i].endDate,
                startTime: resp[i].startTime,
                endTime: resp[i].endTime,
                description: resp[i].description,
                pictures: resp[i].pictures,
                tags: resp[i].tags
            };

            arrayed.push(aEvent);      
        }
        res.render('loadEvents', { events: arrayed, isLoggedIn: req.user !== undefined });
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
