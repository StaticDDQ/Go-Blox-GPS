// JavaScript source code
const express = require('express');
const router = express.Router();

// Get event model
let Event = require('../models/event');

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
    Event.findone({ name: req.params.name }, function (err, resp) {
        if (err) throw err;
        res.send(resp);
    });
});

// get event by tags
router.get('/getEventTags/tags/:tag', function (req, res) {
    // find the event
    Event.find({ tags: req.params.tag }, function (err, resp) {
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