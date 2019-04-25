// JavaScript source code
const express = require('express');
const router = express.Router();
const database = require('../db');

// Bring in User Model
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
    for (let i = 0; i < database.events.length; i++) {
        if (req.params.name === database.events[i].name) {
            res.send(database.events[i]);
            break;
        }
    }
});

// get event by tags
router.get('/getEventTags/tags/:tags', function (req, res) {
    // find the event
    var tagsArray = [];
    for (let i = 0; i < database.events.length; i++) {
        if (database.events[i].tags.includes(req.params.tags)) {
            tagsArray.push(database.events[i]);
        }
    }
    res.send(tagsArray);
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
    for (let i = 0; i < database.events.length; i++) {
        if (req.params.name === database.events[i].name) {
            res.send(database.events[i]);
            database.events.splice(i);
            break;
        }
    }
});

module.exports = router;