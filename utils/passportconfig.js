var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
var models = require("../models/models");
var authUser = models.authUser;
var utils = require('../utils/utils');

if (utils.module_exists('../oauth.js')) {
  var config = require('../oauth.js');
}
var fbclientID = process.env.FBCID || config.facebook.clientID;
var fbclientsecret = process.env.FBCSR || config.facebook.clientSecret;
var fbcallbackurl = process.env.FBCBU || 'http://localhost:3000/auth/facebook/callback';

var liclientID = process.env.LICID || config.linkedin.clientID;
var liclientsecret = process.env.LICSR || config.linkedin.clientSecret;
var licallbackurl = process.env.LICBU || 'http://localhost:3000/auth/linkedin/callback';

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

  passport.use(new LinkedInStrategy({
    clientID: liclientID,
    clientSecret: liclientsecret,
    callbackURL: "http://localhost:3000/auth/linkedin/callback",
    scope: ['r_network', 'r_fullprofile'],
    state: true,
    passReqToCallback: true
  }, function (req, accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
      var lijson = profile._json;
      authUser.update({
        _id: req.user.id
      }, {
        linkedin: {
          id: lijson.id,
          profilelink: lijson.publicProfileUrl,
          pictureUrl: lijson.pictureUrl || 'no_image',
          accessToken: accessToken
        }
      }, function (err) {
        if (err) {
          console.log(err);
        }
        return done(null, null); // keep facebook login as session.
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
