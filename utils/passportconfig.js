var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var models = require("../models/models");
var authUser = models.authUser;
var utils = require('../utils/utils');

if (utils.module_exists('../oauth.js')) {
  var config = require('../oauth.js');
}
var fbclientID = process.env.FBCID || config.facebook.clientID;
var fbclientsecret = process.env.FBCSR || config.facebook.clientSecret;
var fbcallbackurl = process.env.FBCBU || 'http://localhost:3000/auth/facebook/callback';

var passfun = function (app) {
  app.use(passport.initialize());
  app.use(passport.session());
  // passport config
  passport.use(new FacebookStrategy({
    clientID: fbclientID,
    clientSecret: fbclientsecret,
    callbackURL: fbcallbackurl
  }, function (accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
      authUser.findOrCreate({
        'facebook.id': profile.id
      }, {
        'facebook.name': profile.displayName,
        'facebook.profilelink': profile.profileUrl,
        'name': profile.displayName
      }, function (err, user) {
        if (err) {
          return done(err, user);
        } else {
          return done(null, user);
        }
      });
    });
  }));

  // passport serialize and deserialize
  passport.serializeUser(function (user, done) {
    done(null, {
      name: user.name,
      id: user._id
    });
  });
  passport.deserializeUser(function (obj, done) {
    done(null, obj);
  });
};

module.exports = passfun;
