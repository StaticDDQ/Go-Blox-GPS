const mongooseController = require('./mongooseController.js');


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
    new mongooseController.Events(req.body);
// save the event
    newEvent.save(function(err,event){
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
}

module,exports.newEvent = newEvent;
module,exports.getEvent = getEvent;
module,exports.getEventTags = getEventTags;