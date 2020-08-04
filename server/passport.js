//require('./models/userModel')();
var passport = require('passport');
var User = require("mongoose").model("user");
var GoogleTokenStrategy = require('passport-google-token').Strategy;
var config = require("./config.js");

module.exports = function() {
    
    passport.use(new GoogleTokenStrategy({
        clientID: config.googleAuth.clientID,
        clientSecret: config.googleAuth.clientSecret
    },
        function (accessToken, refreshToken, profile, done) {
            User.upsertGoogleUser(accessToken, refreshToken, profile, function (err, user) {
                return done(err, user);
            });
        }))
};
