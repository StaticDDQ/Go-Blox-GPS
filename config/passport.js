const LocalStrategy = require('passport-local').Strategy;
const Member = require('../models/member');

module.exports = function (passport) {

    passport.use(new LocalStrategy(
        
        function (username, password, done) {

            let query = { userName: username };
            Member.findOne(query, function (err, user) {
            if (err) throw err;
    
            if (!user) {
                return done(null, false, { message: 'No user found' });
            }
                
            if (user.password === password)
                return done(null, user);
            else
                return done(null, false);
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