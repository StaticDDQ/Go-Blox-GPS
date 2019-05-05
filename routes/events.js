// JavaScript source code
const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const multer = require('multer');

// Get event model
let Event = require('../models/event');

// {
//     "name": String,
//     "date": Date,
//     "address": String,
//     "description": String,
//     "email": String,
//     "phone": String,
//     "pictures": Object,
//     "tags": [String]
// }

const upload = multer();
var cloudinary = require('cloudinary').v2;
router.post('/addEvent',upload.single("pictures"), function(req,res){
    console.log(req.file);
    // cloudinary.v2.uploader.upload("/home/my_image.jpg", 
    // function(error, result) {console.log(result, error)});
    
} )

// add event
// router.post('/addEvent', upload.single("pictures"), function (req, res) {
//     console.log(req.file);
//     // var img = fs.readFileSync(req.file.path);
//     // var encode_image = img.toString('base64');
//     // var finalImg = {
//     //     contentType: req.file.mimetype,
//     //     image:  new Buffer(encode_image, 'base64'),
//     //     filePath: req.file.path
//     //  };
//     // req.body.pictures = finalImg;
//     req.body.pictures = req.file;
//     console.log(req.body);
//     var addNewEvent = new Event(req.body);
//     addNewEvent.save(function (err, event) {
//         if (err) throw err;
//         res.send(event);
//     });
// });

router.get('/createEvent', function (req, res) {
    res.render('createEvent');
});

// get event
router.get('/getEvent/:name', function (req, res) {
    Event.findOne({name: req.params.name}, function(err, event){
        if(err) throw err;
        res.render('events', event);
    })
});

router.get('/findEvent', function (req, res) {
    res.render('loadEvents');
})

// get events by name
router.post('/getEvents', function (req, res) {
    // find the event
    Event.find({ name: {$regex: req.body.name, $options: 'i' } }, function (err, resp) {
        if (err) throw err;
        res.render('loadEvents', { events: resp });
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
