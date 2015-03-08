
$(document).ready(function () {
  $.material.init();
});

var currentuser = $('div.navbar #userinfo').attr("user");
if (currentuser === "") {
  currentuser = "None";
}
var currentuserid = $('div.navbar #userinfo').attr("uid");

var logouthandler = function(event) {
  event.preventDefault();
  $.post('/logout').done(homepage).error(onError);
};

$("div.navbar li#signout").on("click", logouthandler);

// hide sign out button if no user
var canyouso = function(username) {
  if (username === "None") {
    $('div.navbar li#signout').remove();
  } else {
    $('div.navbar li#signin').remove();
  }
};

canyouso(currentuser);
