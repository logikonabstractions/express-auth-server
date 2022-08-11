var express = require('express');
var passport = require('passport')
var GoogleStrategy = require('passport-google-oidc')
var FacebookStrategy = require('passport-facebook')
// unsure about that - maybe I can just use the google auth w/o having the users in DB per se
var db = require('../db');
var router = express.Router();

/* GET users listing. */
router.get('/login', function(req, res, next) {
    res.send('respond with a resource');
});

// TODO: this is the route that my LoginWithView.vue needs to send me to
// which will in turn send me to the google federeated login thingy
// eventually might change that to the popup thingy
router.get('/login/federated/google', passport.authenticate('google'))
router.get('/login/federated/facebook', passport.authenticate('facebook'))


// configuring strategies

//googlestrategy
passport.use(new GoogleStrategy({
    clientID: process.env['GOOGLE_CLIENT_ID'],
    clientSecret: process.env['GOOGLE_CLIENT_SECRET'],
    callbackURL: '/oauth2/redirect/google',                     // our own endpoint that google calls with the response to the user's auth business
    scope: [ 'profile' ]
}, function verify(issuer, profile, cb) {
    db.get('SELECT * FROM federated_credentials WHERE provider = ? AND subject = ?', [
        issuer,
        profile.id
    ], function(err, row) {
        if (err) { return cb(err); }
        if (!row) {                                             // new user - add to db & return the user to callback
            db.run('INSERT INTO users (name) VALUES (?)', [
                profile.displayName
            ], function(err) {
                if (err) { return cb(err); }

                var id = this.lastID;
                db.run('INSERT INTO federated_credentials (user_id, provider, subject) VALUES (?, ?, ?)', [
                    id,
                    issuer,
                    profile.id
                ], function(err) {
                    if (err) { return cb(err); }
                    var user = {
                        id: id,
                        name: profile.displayName
                    };
                    return cb(null, user);
                });
            });
        } else {                                                // user in db - return the db row   
            db.get('SELECT * FROM users WHERE id = ?', [ row.user_id ], function(err, row) {
                if (err) { return cb(err); }
                if (!row) { return cb(null, false); }
                return cb(null, row);
            });
        }
    });
}));

// faceit strategy (facebook)
passport.use(new FacebookStrategy({
    clientID: process.env['FACEBOOK_CLIENT_ID'],
    clientSecret: process.env['FACEBOOK_CLIENT_SECRET'],
    callbackURL: 'http://localhost:3000/oauth2/redirect/facebook',                     // our own endpoint that google calls with the response to the user's auth business
    scope: [ 'email' ]
}, function verify(issuer, profile, cb) {
    db.get('SELECT * FROM federated_credentials WHERE provider = ? AND subject = ?', [
        issuer,
        profile.id                                                    // the fabook profile doesn't have an ID, I think that's the error here
    ], function(err, row) {
        if (err) { return cb(err); }
        if (!row) {                                             // new user - add to db & return the user to callback
            db.run('INSERT INTO users (name) VALUES (?)', [
                profile.displayName
            ], function(err) {
                if (err) { return cb(err); }

                var id = this.lastID;
                db.run('INSERT INTO federated_credentials (user_id, provider, subject) VALUES (?, ?, ?)', [
                    id,
                    issuer,
                    profile.id
                ], function(err) {
                    if (err) { return cb(err); }
                    var user = {
                        id: id,
                        name: profile.displayName
                    };
                    return cb(null, user);
                });
            });
        } else {                                                // user in db - return the db row
            db.get('SELECT * FROM users WHERE id = ?', [ row.user_id ], function(err, row) {
                if (err) { return cb(err); }
                if (!row) { return cb(null, false); }
                return cb(null, row);
            });
        }
    });
}));


passport.serializeUser(function (user, cb){
    console.log("Passport serializeUser")
    cb(null, {id: user.id, username: user.username, name: user.name});
});

passport.deserializeUser(function (user, cb){
    console.log("Passport deserializeUser")
    process.nextTick(function (){
        return cb(null, user);
    });
});

module.exports = router;
