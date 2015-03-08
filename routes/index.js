var path = require("path");
var models = require(path.join(__dirname, "../models/models"));
var apis = require('./apis');

var mainroutes = {};
var home = function (req, res) {
  connections = apis.liconnects(req, res, function(parsedconns) {
    res.render('home', {
      currentuser: {
        name: req.user.name,
        _id: req.user.id
      },
      connections: parsedconns
    });
  });


};
mainroutes.home = home;
module.exports = mainroutes;
