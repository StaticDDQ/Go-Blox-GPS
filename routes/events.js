// JavaScript source code
const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
var cloudinary = require('cloudinary').v2;
var NodeGeoCoder = require("node-geocoder");

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

// add event
router.post('/addEvent', upload.single("pictures"), async function (req, res) {

    // check each element for validity
    req.checkBody('name', 'Event name is required').notEmpty();
    req.checkBody('address', 'Address is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('description', 'Description is required').notEmpty();
    req.checkBody('phone', 'Phone number is required').notEmpty();

    // get geo code
    geocoder.geocode({address: req.body.address, limit: 1}, function(err,resp){
        req.body.location = resp[0];
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
            addNewEvent['organizer'] = req.user.userName;
            addNewEvent.save(function (err, event) {
                if (err) throw err;
                res.render('eventDetails', { event: event });
            });
        } else {
            res.render('createEvent', { errors: 'Require atleast 1 tag' });
        }

    } else {
        res.render('createEvent', { errors: 'Incorrect event creation' });
    }
});

router.get('/maps', function(req,res){
    Event.aggregate([{ $sample: { size: 2} }]).exec(function(err, resp){
        if(err) throw err;
        var arrayed = []
        for (let i = 0; i < resp.length; i++){
            var aEvent ={
                name: resp[i].name,
                lat: parseFloat(resp[i].location[0].latitude),
                long: parseFloat(resp[i].location[0].longitude)
            };

            arrayed.push(aEvent);


            
        }
        
        res.render('maps', {events: arrayed});
    });
});

//change back to post
router.get('/createEvent', function (req, res) {
    if (req.user === undefined)
        res.end();
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
                
                res.render('eventDetails', { event: event, ratings: result });
            });
        } else {
            res.render('notFound');
        }
    })
});

router.get('/findEvent', function (req, res) {
    if (req.user === undefined) {
        res.end();
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
                res.joinedUsers.push(req.user.userName);
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
