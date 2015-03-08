// Routes related to signing in and signing out.

var authroutes = {};

var login = function(req, res) {
  res.render('login', {
    currentuser: {
      name: "",
      _id: ""
    }
  });
};

authroutes.login = login;

var ensureAuthenticated = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
};

authroutes.ensureAuthenticated = ensureAuthenticated;

module.exports = authroutes;
