const express = require('express');
const app = express();
const path = require('path');
const database = require('./db');
const mongooseController = require('./controller/mongooseController.js');
const bodyParser = require('body-parser');
const apiController = require("./controller/apiController");

var port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true})) 


app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname+ '/home.html'));
});

/***************************  MEMBERS  ***************************/

// get member (get from mockup database)
app.get('/getFirstname/:firstname', function (req,res){
    apiController.getMember(req,res);
});

// register as member
app.post('/register',function(req,res){
    mongooseController.addUser(req,res);
})

// update member
app.put('/updateMember/:userName',function(req,res){
    apiController.newMember(req,res);
})

// delete member
app.delete('/deleteMember/:username', function(req,res){
    for(let i = 0; i < database.events.length; i++){
        if(req.params.username === database.members[i].userName){
            res.send(database.members[i]);
            database.members.splice(i);
            break;
        }
    }
});

/***************************  EVENTS  ***************************/

// add event
app.post('/addEvent', function (req, res) {
    apiController.newEvent(req,res);
});

// get event
app.get('/getEvent/:name',function(req,res){
    apiController.getEvent(req,res);
});

// get event by tags
app.get('/getEventTags/tags/:tags',function(req,res){
    // find the event
    apiController.getEventTags(req,res);
});

// update event
app.put('/updateEvent/:name',function(req,res){
    apiController.updateEvent(req,res);
});

// delete event
app.delete('/deleteEvent/:name', function (req, res) {
    for(let i = 0; i < database.events.length; i++){
        if (req.params.name === database.events[i].name) {
            res.send(database.events[i]);
            database.events.splice(i);
            break;
        }
    }
});

/***************************  PLACES  ***************************/

// add places
app.post('/addPlace', function (req, res) {
    apiController.newPlace(req,res);
});


// get place
app.get('/getPlace/:placeName',function(req,res){
    apiController.getPlace(req,res);
});

// update places
app.put('/updatePlace/:placeName',function(req,res){
    apiController.updatePlace(req,res);
});

// delete places
app.delete('/deletePlace/:placeName',function(req,res){
    for(let i = 0; i < database.places.length; i++){
        if(req.params.placeName === database.places[i].placeName){
            res.send(database.places[i]);
            break;
        }
    }
});

/***************************  RATINGS  ***************************/

// give rating
app.post('/addRating', function (req, res) {
    apiController.newRating(req,res);
});

// get rating
app.get('/getRating/:eventID',function(req,res){
    apiController.getRating(req,res);
});

app.listen(port,function(){
    console.log("Listening to port "+ port);
});
