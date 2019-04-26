const BasicStrategy = require('passport-http').BasicStrategy;
const Member = require('../models/member');
const bcrypt = require('bcryptjs');

module.exports = function (passport) {

    passport.use(new BasicStrategy({
        usernameField: 'user',
        passwordField: 'password'
    },
        function (username, password, done) {
            console.log(username);
            console.log(password);
            let query = { userName: username };
            Member.findOne(query, function (err, user) {
            if (err) throw err;
            
            if (!user) {
                return done(null, false, { message: 'No user found' });
            }
                // Match password
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    console.log(isMatch);
                if (err) throw err;
                if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: 'Password incorrect' });
                }
            });
        });
    }));

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        Member.findById(id, function (err, user) {
            done(err, user);
        });
    });
};