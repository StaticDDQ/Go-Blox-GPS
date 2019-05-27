const express = require('express');
const app = express();
const path = require('path');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const session = require('express-session');

// use moment to format date and time
app.locals.moment = require('moment');

// models to use for sampling
let Event = require('./models/event');
let Places = require('./models/place');

var port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
app.use(expressValidator());
app.set('view engine','pug');

var options = {
    useNewUrlParser: true
};

mongoose.connect(config.database, options)
    .catch((err) => console.log("ERORR:" + err));

require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

// route to about page
app.get('/places', function (req, res) {
    if (req.user !== undefined) {
        Places.find({}).exec(function (err, resp) {
            if (err) throw err;
            var placeArr = [];
            for (let i = 0; i < resp.length; i++) {
                var aPlaces = {
                    id: resp[i]._id,
                    placeName: resp[i].placeName,
                    lat: parseFloat(resp[i].location[0].latitude),
                    long: parseFloat(resp[i].location[0].longitude),
                    placeAddress: resp[i].placeAddress,
                    phone: resp[i].placePhone,
                    pictures: resp[i].pictures
                };

                placeArr.push(aPlaces);
            };
            res.render('loadPlacesFirst', {places: placeArr, isLoggedIn: req.user !== undefined});
        });
    }
    else {
        res.redirect('/');
    }
});

// route to about page
app.get('/', function (req, res) {
    
    Event.aggregate([{ $sample: { size: 5} }]).exec(function(err, resp){
        if(err) throw err;
        var arrayed = []
        for (let i = 0; i < resp.length; i++){
            var aEvent = {
                id: resp[i]._id,
                name: resp[i].name,
                organizer: resp[i].organizer,
                description: resp[i].description,
                lat: parseFloat(resp[i].location[0].latitude),
                long: parseFloat(resp[i].location[0].longitude),
                address: resp[i].address,
                phone: resp[i].phone,
                email: resp[i].email,
                pictures: resp[i].pictures
            };

            arrayed.push(aEvent);        
        }
        
        Places.aggregate([{ $sample: { size: 5} }]).exec(function(err, resp){
            if (err) throw err;
            var placeArr = [];
            for (let i = 0; i < resp.length; i++){
                var aPlaces = {
                    id: resp[i]._id,
                    placeName: resp[i].placeName,
                    lat: parseFloat(resp[i].location[0].latitude),
                    long: parseFloat(resp[i].location[0].longitude),
                    placeAddress: resp[i].placeAddress,
                    phone: resp[i].placePhone,
                    pictures: resp[i].pictures
                };
    
                placeArr.push(aPlaces);
            };
            res.render('maps', { events: arrayed, places: placeArr, isLoggedIn: req.user !== undefined });
        });
    });    

});

app.use(express.static(path.join(__dirname, 'public')));

// Route Files
let places = require('./routes/places');
let members = require('./routes/members');
let ratings = require('./routes/ratings');
let events = require('./routes/events');

app.use('/places', places);
app.use('/members', members);
app.use('/events', events);
app.use('/ratings', ratings);

app.listen(port,function(){
    console.log("Listening to port "+ port);
});

app.get('*', function (req, res) {
    res.render('notFound');
});