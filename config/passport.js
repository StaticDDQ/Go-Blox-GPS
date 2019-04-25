const LocalStrategy = require('passport-local').Strategy;
const Member = require('../models/member');
const config = require('../config/database');
const bcrypt = require('bcryptjs');

module.exports = function (passport) {
    passport.use(new LocalStrategy(function (username, password, done) {
        let query = { userName: username };
        Member.findOne(query, function (err, user) {
            if (err) throw err;

            if (!user) {
                return done(null, false, { message: 'No user found' });
            }

            bcrypt.compare(password, user.password, function (err, isMatch) {
                if (err) throw err;
                if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, user, { message: 'wrong password' });
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