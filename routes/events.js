// JavaScript source code
const express = require('express');
const router = express.Router();

// Get event model
let Event = require('../models/event');

// {
//     "name": String,
//     "date": Date,
//     "address": String,
//     "description": String,
//     "email": String,
//     "phone": String,
//     "pictures": String,
//     "tags": [String]
// }

// add event
router.post('/addEvent', function (req, res) {
    var addNewEvent = new Event(req.body);
    addNewEvent.save(function (err, event) {
        if (err) throw err;
        res.send(event);
    });
});

// get event
router.get('/getEvent/:name', function (req, res) {
    Event.findOne({name: req.params.name}, function(err, event){
        if(err) throw err;
        res.render("../public/views/events.pug", event);
    })
});

// get event by tags
router.get('/getEventTags/tags', function (req, res) {
    // find the event
    Event.find({ tags: {$all: req.body.tag} }, function (err, resp) {
        if (err) throw err;
        res.send(resp);
    });
});

// update event
router.put('/updateEvent/:name', function (req, res) {
    Event.findOneAndUpdate(
        { name: req.params.name }, { $set: req.body }, function (err, resp) { //callback functions
            res.send(resp);
        });
});

// delete event
router.delete('/deleteEvent/:name', function (req, res) {
    Event.findOneAndDelete({ name: req.params.name }, function (err, resp) {
        if (err) throw err;
        res.send(resp);
    })
});

module.exports = router;