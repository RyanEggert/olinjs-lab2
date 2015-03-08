var path = require("path");
var models = require(path.join(__dirname, "../models/models"));

var mainroutes = {};
var home = function (req, res) {
  res.render('home', {
    currentuser: {
      name: req.user.name,
      _id: req.user.id
    }
  });
};
mainroutes.home = home;
module.exports = mainroutes;
