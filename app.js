//// GIFTR ////
// "Things for some people" //

// external requirements
var express = require("express");
var exphbs = require("express-handlebars");
var path = require("path");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var session = require('express-session');
var mongoose = require("mongoose");

// internal requirements
var apis = require('./routes/apis');
var index = require('./routes/index');
var users = require('./routes/users');
var authrs = require('./routes/auth');
var utils = require('./utils/utils');
if (utils.module_exists('./oauth.js')) {
  var config = require('./oauth.js');
}
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var passportconfig = require('./utils/passportconfig');

// app creation & configuration
var app = express();

var hbs = exphbs.create({
  helpers: {
    grouped_each: utils.grouped_each
  },
  defaultLayout:"main"
});

var PORT = process.env.PORT || 3000;
var mongoURI = process.env.MONGOURI || "mongodb://localhost/test";

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true
}));
passportconfig(app);

// routes
app.get('/', authrs.ensureAuthenticated, index.home);
app.get('/gift/:name', index.gift_get);
app.post('/gift/:name', index.gift_get);

app.get('/login', authrs.login);
app.post('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});

app.post('/users/new/', users.new);

app.get('/auth/facebook/',
  passport.authenticate('facebook', {
    failureRedirect: '/login'
  }),
  function (req, res) {
    res.redirect('/');
  });

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', {
    failureRedirect: '/'
  }),
  function (req, res) {
    res.redirect('/auth/linkedin');
  });

app.get('/auth/linkedin/',
  passport.authenticate('linkedin'),
  function (req, res) {});

app.get('/auth/linkedin/callback',
  passport.authenticate('linkedin', {
    failureRedirect: '/'
  }),
  function (req, res) {
    res.redirect('/apis');
  });

// connections
mongoose.connect(mongoURI);
app.listen(PORT, function () {
  console.log("Application running on port:", PORT);
});
