var path = require("path");
var models = require(path.join(__dirname, "../models/models"));
var apis = require('./apis');

var mainroutes = {};
var home = function (req, res) {
  connections = apis.liconnects(req, res, function (parsedconns) {
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

var gift_get = function (req, res) {
  var recname = req.params.name.split('_').join(' ');
  res.render('giftconfig', {
    recipient: {
      name: recname
    }
  });
};

mainroutes.gift_get = gift_get;

var gift_post = function (req, res) {
  var data = {};
  data.money = req.body.money;
  data.sent_user = req.body.sent_user;
  data.rec_user = req.body.rec_user;
  //add rec user info
  res.send(data);
};

mainroutes.gift_post = gift_post;

module.exports = mainroutes;
