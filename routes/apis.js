// Routes related to calling APIs.

var models = require("../models/models");
var authUser = models.authUser;
var apiroutes = {};

var Linkedin = require('node-linkedin')('api', 'secret', 'callback');

var liconnectsparse = function(connections) {
  // Store only the connection information we are interested in
  // [{name, pictureurl, tagline}, ...]
  conout = [];
  for (var i = 0 ; i <= connections.length - 1; i++) {
    var thisout = {};
    thiscon = connections[i];
    thisout.name = thiscon.firstName + ' ' + thiscon.lastName;
    thisout.pictureUrl = thiscon.pictureUrl;
    thisout.tagline = thiscon.headline;
    conout.push(thisout);
  }
  return conout;
};

var liconnects = function (req, res, callback) {
  // Gets list of linkedin connections
  authUser.findOne({
    _id: req.user.id
  }, 'linkedin', function (err, user) {
    var linkedin = Linkedin.init(user.linkedin.accessToken);
    linkedin.connections.retrieve(function (err, connections) {
      if (err) {
        console.log(err);
      }
      var parsed = liconnectsparse(connections.values);
      callback(parsed);
    });
  });
};

apiroutes.liconnects = liconnects;

module.exports = apiroutes;
