// JavaScript source code
const express = require('express');
const router = express.Router();
const path = require('path');
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
// FOR REFERENCES
// "placeName": String,
// "placeAddress": String,
// "placeDescription": String,
// "placePhone": String,
// "placeTags": String,
// "pictures": String
var upload = multer({ storage: storage })

// add places
router.post('/addPlace', upload.single("pictures"), async function (req, res) {
    console.log(req.body);
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
        req.checkBody('placeTags', 'Require atleast 1 tag').notEmpty();
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
            var addNewPlace = new Place(req.body);
            addNewPlace.save(function (err, place) {
                if (err) throw err;
                res.render('placeDetails', { place: place });
            });
        } else {
            res.render('createPlace', { errors: 'Require atleast 1 tag' });
        }

    } else {
        res.render('createPlace', { errors: 'Incorrect place creation' });
    }
});


router.get('/createPlace', function (req, res) {
    if (req.user === undefined)
        res.render('mustLogin');
    else
        res.render('createPlace');
});

// get place
router.get('/getPlace/:id', function (req, res) {
    Place.findById(req.params.id, function (err, place) {
        if (err) throw err;
        if (place != null) {
            res.render('placeDetails', { place: place});
        } else {
            res.render('notFound');
        }
    })
});

// get events by name
router.post('/getPlaces', function (req, res) {
    // find the event
    Place.find({
        $or: [
            { placeName: { $regex: req.body.name, $options: 'i' } },
            { placeAddress: { $regex: req.body.name, $options: 'i' } }
        ]
    }, function (err, resp) {
        if (err) throw err;
        res.render('loadPlaces', { places: resp });
    });
});

// update places
router.put('/updatePlace/:placeName', function (req, res) {
    Place.findOneAndUpdate(
        { placeName: req.params.placeName }, { $set: req.body }, function (err, resp) { //callback functions
            res.send(resp);
        });
});

// delete places
router.delete('/deletePlace/:placeName', function (req, res) {
    Place.findOneAndDelete(
        { placeName: req.params.placeName }, function (err, resp) {
            if (err) throw err;
            res.send(resp);
        }); 
});

module.exports = router;



// // to show to get long and lat
// var options = {
//     provider: 'openstreetmap'
// };
// var geocoder = NodeGeoCoder(options);

// // setting up storage to upload media
// var storage = multer.diskStorage({
//     filename: function (req, file, cb) {
//         cb(null, file.originalname + '-' + Date.now())
//     }
// });

// var upload = multer({ storage: storage })



// router.get('/maps', function(req,res){
//     Event.aggregate([{ $sample: { size: 2} }]).exec(function(err, resp){
//         if(err) throw err;
//         var arrayed = []
//         for (let i = 0; i < resp.length; i++){
//             var aEvent ={
//                 name: resp[i].name,
//                 lat: parseFloat(resp[i].location[0].latitude),
//                 long: parseFloat(resp[i].location[0].longitude)
//             };

//             arrayed.push(aEvent);


            
//         }
        
//         res.render('maps', {events: arrayed});
//     });
// });

// //change back to post
// router.get('/createEvent', function (req, res) {
//     if (req.user === undefined)
//         res.render('mustLogin');
//     else
//         res.render('createEvent');
// });

// // get event
// router.get('/getEvent/:id', function (req, res) {
//     Event.findById(req.params.id, function (err, event) {
//         if (err) throw err;
//         if (event != null) {
//             Rating.find({ eventID: req.params.id }, function (err, result) {
//                 if (err) throw err;
                
//                 res.render('eventDetails', { event: event, ratings: result });
//             });
//         } else {
//             res.render('notFound');
//         }
//     })
// });

// router.get('/findEvent', function (req, res) {
//     if (req.user === undefined) {
//         res.render('mustLogin');
//     } else {
//         res.render('loadEventsFirst');
//     }
// })

// // get events by name
// router.post('/getEvents', function (req, res) {
//     // find the event
//     Event.find({
//         $or: [
//             {name: {$regex: req.body.name, $options: 'i' }},
//             {email: {$regex: req.body.name, $options: 'i' }},
//             {organizers: {$regex: req.body.name, $options: 'i' }}
//         ] }, function (err, resp) {
//         if (err) throw err;
//         res.render('loadEvents', { events : resp});
//     });
// });

// // update event
// router.put('/updateEvent/:name', function (req, res) {
//     Event.findOneAndUpdate(
//         { name: req.params.name }, { $set: req.body }, function (err, resp) { //callback functions
//             res.send(resp);
//         });
// });

// // if user joined an event append the name (and maybe link) to the user's json
// router.put('/addUser/:name', function (req, res) {
//     var event = Event.findone({ name: req.params.name });
//     var obj = JSON.parse(event);
//     obj['joinedUsers'].push(req.body.username);
//     jsonStr = JSON.stringify(obj);
//     Event.findOneAndUpdate(
//         { name: req.params.name }, { $set: jsonStr });
// });

// // delete event
// router.delete('/deleteEvent/:name', function (req, res) {
//     Event.findOneAndDelete({ name: req.params.name }, function (err, resp) {
//         if (err) throw err;
//         res.send(resp);
//     })
// });

// // map event
// router.get('/getMap', function (req, res){
//     res.sendFile(path.join(__dirname, '../public/map.html'));
// });

// // add a user to the joinedUsers array of an event
// router.put('/joinEvent', function (req, res) {
//     if (req.user === undefined) {
//         res.error();
//     } else {
//         Event.findById(req.body.id, function (err, result) {
//             if (!result.joinedUsers.includes(req.user.userName)) {
//                 res.joinedUsers.push(req.user.userName);
//                 result.save(function (err) {
//                     if (err) throw err;
//                 });
//             }
//             res.send(result);
//         });
//     }
// });

// // remove user from the joinedUsers array of an event
// router.put('/declineEvent', function (req, res) {
//     if (req.user === undefined) {
//         res.error();
//     } else {
//         Event.findByIdAndUpdate(req.body.id, { $pull: { 'joinedUsers': req.user.userName } }, function (err, result) {
//             res.send(result);
//         });
//     }
// });

// // Get name of event after looking up the ID
// router.post('/getEventById', function (req, res) {

//     Event.findById(req.body.id, function (err, result) {
//         if (err) throw err;
//         if (result) res.send(result.name);
//     });
// });

// module.exports = router;
