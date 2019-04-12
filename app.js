const express = require('express');
const app = express();
const database = require('./db');
const mongooseController = require('./controller/mongooseController.js');
const bodyParser = require('body-parser');
const apiController = require("./controller/apiController");

var port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true})) 


app.get('/', function(req,res){
    res.send("Welcome to our GPS");
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
    var newMember = mongooseController.Members.findOneAndUpdate(
        {userName: req.params.userName}, {$set: req.body}, function(err,resp){ //callback functions
            res.send(resp)
        });

})

// delete member
app.delete('/deleteMember/:username', function(req,res){
    for(let i = 0; i < database.events.length; i++){
        if(req.params.username === database.members[i].userName){
            res.send(database.members[i]);
            break;
        }
    }
});

/***************************  EVENTS  ***************************/

// add event
app.post('/addEvent', function (req, res) {
    var newEvent = new mongooseController.Events(req.body);
    // save the event
    newEvent.save(function(err,event){
        if(err) throw err;
        res.send(event);
    })
});

// get event
app.get('/getEvent/:name',function(req,res){
    // find the event
    for(let i = 0; i < database.events.length; i++){
        if(req.params.name === database.events[i].name){
            res.send(database.events[i]);
            break;
        }
    }

});

// get event by tags
app.get('/getEventTags/tags/:tags',function(req,res){
    // find the event
    var tagsArray = [];
    for(let i = 0; i < database.events.length; i++){
        if(database.events[i].tags.includes(req.params.tags)){
            tagsArray.push(database.events[i]);
            
        }
    }
    res.send(tagsArray);
});

// update event
app.put('/updateEvent/:name',function(req,res){
    var newEvent = mongooseController.Events.findOneAndUpdate(
        {name: req.params.name}, {$set: req.body}, function(err,resp){ //callback functions
            res.send(resp)
        });

})

// delete event
app.delete('/deleteEvent/:name',function(req,res){
    for(let i = 0; i < database.events.length; i++){
        if(req.params.name === database.events[i].name){
            res.send(database.events[i]);
            break;
        }
    }
});

/***************************  PLACES  ***************************/

// add places
app.post('/addplaces',function(req,res){
    var newPlaces = {
        placeName: req.body.placeName,
        placeAddress: req.body.placeAddress,
        placeDescription: req.body.placeDescription,
        placePhone: req.body.placePhone,
        placeTags: req.body.placeTags

    }
    // save the places
    newPlaces.save(function(err,places){
        res.send(places)
        .catch(console.log(err));
    })
});

// get places
app.get('/getPlace/:placeName',function(req,res){
    // find the place
    var found = false;
    for(let i = 0; i < database.places.length; i++){
        //console.log(database.places[i].placeAddress);
        if(req.params.placeName === database.places[i].placeName){
            res.send(database.places[i]);
            found = true;
            break;
        }
    }
});

// update places
app.put('/updatePlace/:placeName',function(req,res){
    var newPlace = mongooseController.Places.findOneAndUpdate(
        {placeName: req.params.placeName}, {$set: req.body}, function(err,resp){ //callback functions
            res.send(resp)
        });

})

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
app.post('/addratings',function(reg,res){
    var newRatings = {
        star : req.body.star,
        comment : req.body.comment,
        datePublished : req.body.datePublished
    }
});

// get rating
app.get('/getRating/:index', function(req,res){
    // get index of comment
    for(let i=0 ; i < database.ratings.length; i++){
        if(req.params.index === database.ratings[i].index){
            res.send(database.ratings[i]);
            break;
        }
    }
});

app.listen(port,function(){
    console.log("Listening to port "+ port);
});
