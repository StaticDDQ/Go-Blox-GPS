const BasicStrategy = require('passport-http').BasicStrategy;
const Member = require('../models/member');

module.exports = function (passport) {
    passport.use(new BasicStrategy(function (username, password, done) {
        
        let query = { userName: username };
        Member.findOne(query, function (err, user) {
            if (err) throw err;
            
            if (!user) {
                return done(null, false, { message: 'No user found' });
            }
            console.log(user);
            if (!user.validPassword(password)) {
                return done(null, false, { message: 'wrong password' })
            }
            return done(null, user);
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