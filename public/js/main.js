$(document).ready(function () {
  $.material.init();
  $("input.currency").autoNumeric('init');
});

// facebook #_=_ fix
if (window.location.hash && window.location.hash == '#_=_') {
  window.location.hash = '';
}
if (window.location === '/#') {window.location = '/';}

var homepage = function (data, status) {
  window.location.replace('/');
};
var currentuser = $('div.navbar #userinfo').attr("user");
if (currentuser === "") {
  currentuser = "None";
}
var currentuserid = $('div.navbar #userinfo').attr("uid");

var logouthandler = function (event) {
  event.preventDefault();
  $.post('/logout').done(homepage).error(onError);
};

$("div.navbar li#signout").on("click", logouthandler);

// hide sign out button if no user
var canyouso = function (username) {
  if (username === "None") {
    $('div.navbar li#signout').remove();
  } else {
    $('div.navbar li#signin').remove();
  }
};

canyouso(currentuser);

$("div#personpane .friend").hover(
  function () {
    $(this).removeClass("shadow-z-2");
    $(this).addClass("shadow-z-3");
  },
  function () {
    $(this).removeClass("shadow-z-3");
    $(this).addClass("shadow-z-2");
  }
);

$("div#personpane .friend").mousedown(
  function () {
    $(this).removeClass("shadow-z-3");
    $(this).addClass("shadow-z-1");
  });

$("div#personpane .friend").mouseup(
  function () {
    $(this).removeClass("shadow-z-1");
    $(this).addClass("shadow-z-3");
  });

$("div.friend").click(
  function () {
    var redirname = $(this).attr('frname').split(' ').join('_');
    location = ('/gift/' + redirname + '/');
  });



// Gift form submission

$('form#giftconfig').submit(function(event) {
  event.preventDefault();
  $("form#giftconfig").remove();
  $("div.titlebox h1").html('Please wait...');
  $("div#mainscroll").html('<i class="fa fa-spinner fa-pulse"></i>');
  // send parameters to server

  // recieve rendered handlebars and display
});
