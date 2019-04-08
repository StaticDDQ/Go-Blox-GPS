const express = require('express');
const app = express();
const database = require('./db');

var port = process.env.PORT || 3000;

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

})
// update member
app.put('/updateMember',function(req,res){
    
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
app.get('/event/get',function(req,res){
    // find the event
    for(let i = 0; i < database.events.length; i++){
        if(req.params.name === database.events[i].name){
            res.send(database.events[i]);
            break;
        }
    }


    
})

// give rating

// 

app.listen(port,function(){
    console.log("Listening to port "+ port);
});


