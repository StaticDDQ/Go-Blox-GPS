// JavaScript source code
const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
var cloudinary = require('cloudinary').v2;
var cloudConfig = require("../config/cloudinary");

// Get event model
let Event = require('../models/event');


var storage = multer.diskStorage({
    filename: function (req, file, cb) {
      cb(null, file.originalname + '-' + Date.now())
    }
  })
   
var upload = multer({ storage: storage })

// add event
router.post('/addEvent',upload.single("pictures"), async function(req,res){
    var reqURL;
    // cloudinary.image(req.file.path, {width: 0.5, crop: "scale"});
    await cloudinary.uploader.upload(req.file.path,
        { eager : [
            {width: 0.5, crop: "scale"}]
        },
    function(error, result) {
        reqURL = result.secure_url;

    });
    req.body.pictures = reqURL;
    var addNewEvent = await new Event(req.body);
    addNewEvent.save(function (err, event) {
        if (err) throw err;
        res.send(event);
    });

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
    res.render('loadEvents', {events : []});
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
