const express = require('express');
const app = express();
const database = require('./db');

var port = process.env.PORT || 3000;

app.get('/', function(req,res){
    res.send("Welcome to our GPS");
});

app.get('/:firstname', function(req,res){
    res.send(database.members[req.params.firstname]);
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

app.get('/event/get',function(req,res){
    
})

app.listen(port,function(){
    console.log("Listening to port "+ port);
});


