const express = require('express');
const app = express();
const database = require('./db');
//const mongoose = require('./mongoose.js');
const bodyParser = require('body-parser');

var port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true})) 


app.get('/', function(req,res){
    res.send("Welcome to our GPS");
});

app.get('/getFirstname/:firstname', function(req,res){
    for(let i = 0; i< database.members.length;i++){
        if(req.params.firstname === database.members[i].firstName){
            res.send(database.members[i]);
            break;
        }
    }
})

//register as member
app.post('/register',function(req,res){
    var data = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        DOB: req.body.DOB,
        userName: req.body.userName,
        password: req.body.password,
        email: req.body.email
    };
    res.send(data);

})
// update member
app.put('/updateMember',function(req,res){
    var accountUpdate = req.body.userName;
})


// add event
app.post('/addevent',function(req,res){
    var newEvent = {
        name: req.body.name,
        date: req.body.date,
        address: req.body.address,
        description: req.body.description,
        contact: req.body.contact,
        pictures: req.body.pictures,
        tags: req.body.tag

    }
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

//delete member
app.delete('/deleteMember/:username', function(req,res){
    for(let i = 0; i < database.events.length; i++){
        if(req.params.username === database.members[i].userName){
            res.send(database.members[i]);
            break;
        }
    }
});

//delete event
app.delete('/deleteEvent/:name',function(req,res){
    for(let i = 0; i < database.events.length; i++){
        if(req.params.name === database.events[i].name){
            res.send(database.events[i]);
            break;
        }
    }
});

app.listen(port,function(){
    console.log("Listening to port "+ port);
});
