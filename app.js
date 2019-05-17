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
app.get('/about', function (req, res) {
    if (req.user === undefined)
        res.render('about');
    else {
        res.render('userAbout');
    }
});

// route to about page
app.get('/places', function (req, res) {
    res.render('comingSoon');
});

// route to about page
app.get('/', function (req, res) {
    if (req.user === undefined)
        res.render('home');
    else {
        res.render('userHome');
    }
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