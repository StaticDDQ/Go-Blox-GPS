const express = require('express');
const app = express();
const path = require('path');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');

var port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true})) 

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

app.get('*', function (req, res, next) {
    res.locals.user = req.user || null;
    next();
});

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/index.html'));
    app.use(express.static(path.join(__dirname, 'public')));
});

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
