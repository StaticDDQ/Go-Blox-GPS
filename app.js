const express = require('express');
const app = express();
const database = require('./db');
const mongoose = require('./controller/mongoose.js');
const schema = require('./controller/schemaController');
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
var Members = mongoose.model("members",schema);
app.post('/register',function(req,res){
    var data = new Members({
        "firstName": req.body.firstName,
        "lastName": req.body.lastName,
        "DOB": req.body.DOB,
        "userName": req.body.userName,
        "password": req.body.password,
        "email": req.body.email
    });
    // res.send(data);
    data.save(function(err,newMember){
        if(!err){
            res.send(newMember);
        } else{
            res.sendStatus(400);
        }
    })
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
app.get('/event/get',function(req,res){
    // find the event


    
})

// give rating

// 

app.listen(port,function(){
    console.log("Listening to port "+ port);
});


