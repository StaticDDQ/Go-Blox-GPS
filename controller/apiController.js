const mongooseController = require('./mongooseController.js');
const database = require('./../db');


/***************************  MEMBERS  ***************************/

// get member
var getMember = (req,res) => {
    for(let i = 0; i< database.members.length;i++){
        if(req.params.firstname === database.members[i].firstName){
            res.send(database.members[i]);
            break;
        }
    }
}

// update member
var newMember = (req,res) => {
    mongooseController.Members.findOneAndUpdate(
        {userName: req.params.userName}, {$set: req.body}, function(err,resp){
         res.send(resp);
    })
};

module.exports.getMember = getMember;
module.exports.newMember = newMember;

/***************************  EVENTS  ***************************/

// add event
var newEvent = (req,res) => {
    
// save the event
    var addNewEvent = new mongooseController.Events(req.body);
    addNewEvent.save(function(err,event){
        if(err) throw err;
        res.send(event);
    })
}

// get event
var getEvent = (req,res) => {
    for(let i = 0; i < database.events.length; i++){
        if(req.params.name === database.events[i].name){
            res.send(database.events[i]);
            break;
        }
    }
}

// get event by tags
var getEventTags = (req,res) => {
    var tagsArray = [];
    for(let i = 0; i < database.events.length; i++){
        if(database.events[i].tags.includes(req.params.tags)){
            tagsArray.push(database.events[i]);
        }
    }
    res.send(tagsArray);
};

// update events
var updateEvent = (req,res) => {
    mongooseController.Events.findOneAndUpdate(
    {name: req.params.name}, {$set: req.body}, function(err,resp){ //callback functions
        res.send(resp);
    });
};

module.exports.newEvent = newEvent;
module.exports.getEvent = getEvent;
module.exports.getEventTags = getEventTags;
module.exports.updateEvent = updateEvent;

/***************************  PLACES  ***************************/

// add places
var newPlace = (req,res) => {
    
    // save the places
        var addNewPlace = new mongooseController.Places(req.body);
        addNewPlace.save(function(err,places){
            if(err) throw err;
            res.send(places);
        })
    }
    
    // get places
    var getPlace = (req,res) => {
        for(let i = 0; i < database.places.length; i++){
            if(req.params.placeName === database.places[i].placeName){
                res.send(database.places[i]);
                break;
            }
        }
    }
    
    // update places
    var updatePlace = (req,res) => {
        mongooseController.Places.findOneAndUpdate(
        {placeName: req.params.placeName}, {$set: req.body}, function(err,resp){ //callback functions
            res.send(resp);
        });
    };

    module.exports.newPlace = newPlace;
    module.exports.getPlace = getPlace;
    module.exports.updatePlace = updatePlace;


    /***************************  RATINGS  ***************************/

// add rating
var newRating = (req,res) => {
    
    // save the rating
        var addNewRating = new mongooseController.Ratings(req.body);
        addNewRating.save(function(err,ratings){
            if(err) throw err;
            res.send(ratings);
        })
    }
    
    // get rating
    var getRating = (req,res) => {
        for(let i = 0; i < database.ratings.length; i++){
            if((Number)(req.params.eventID) === database.ratings[i].eventID){
                res.send(database.ratings[i]);
                break;
            }
        }
    }
    
module.exports.getRating = getRating;
module.exports.newRating = newRating;