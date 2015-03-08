$(window).scroll(function() {
  if ($(window).scrollTop() >= 1) {
    $('nav').addClass('fixed-header');
  } else {
    $('nav').removeClass('fixed-header');
  }
});

//Variables
var $deletebuttons = $("button.delete");
$newcheepin = $('form#newcheep');
var currentuser = $('nav').attr("user");
if (currentuser === "") {
  currentuser = "None";
}
var currentuserid = $('nav').attr("uid");
var $gift_form = $("#gift_form");

//Event Callback Funtions
var shownewtweet = function(data, status) {
  $('div.newcheep').after(data);
  $newcheepin.find('#in_cheep').val('');
  yourdeletebuttons(currentuserid);
};

var hideoldtweet = function(data, status) {
  $('div.cheep#' + String(data._id)).hide(1000);
};

var homepage = function(data, status) {
  window.location.replace('/');
};

var onError = function(data, status) {
  console.error(data);
};

var deletehandler = function(event) {
  event.preventDefault();
  orderid = $(this).attr('id'); //get order id to cancel
  $.ajax("/cheep/delete/", {
      type: "DELETE",
      data: {
        orderid: orderid
      }
    })
    .done(hideoldtweet)
    .error(onError);
};

var highlightcheeps = function(event) {
  event.preventDefault();
  // unhighlight other users
  $("div#users div").css('background-color', 'transparent');
  // highlight clicked user
  $(this).css('background-color', 'yellow');
  // unhighlight all cheeps
  $("div.cheep").css('background-color', 'rgb(130, 150, 200)');
  // highlight user's cheeps
  $("div.cheep[uid=" + $(this).attr('uid') + "]").css('background-color', 'yellow');
};

var unhighlightcheeps = function(event) {
  event.preventDefault();
  // unhighlight all users & cheeps
  $("div#users div").css('background-color', 'transparent');
  $("div.cheep").css('background-color', 'rgb(130, 150, 200)');
};

var logouthandler = function(event) {
  event.preventDefault();
  $.post('/logout').done(homepage).error(onError);
};

var newcheep = function() {
  cheep = $newcheepin.find('#in_cheep').val();
  $.post('/cheep/new/', {
    'username': currentuser,
    'words': cheep
  }).done(shownewtweet).error(onError);
};

var gift_submit = function() {
  var money = $gift_form.find('#money').val();
  var sent_user = document.getElementById("sent_user").innerHTML;
  var rec_user = document.getElementById("rec_user").value;
  console.log(rec_user);
  $.post('/gift/'+sent_user, {
    'money': money,
    'sent_user': sent_user,
    'rec_user': rec_user
    //add information about sent_user and rec_user
  })
  .done(function(data, status) {
    $("#gift_form").hide(1000);
    $("#random_gift").append(data.sent_user + ", you spend $" + data.money + " on " + data.rec_user + ", below is the random gift's information~")
  .error(
    function(data, status) {
      console.log("status", status);
      console.log("error", data);
    });
  });
}

// Page Functions
if (currentuser === "") {
  $newcheepin.hide();
}

// if "Cheep!" button pressed, send new cheep
$newcheepin.submit(function(event) {
  event.preventDefault();
  newcheep();
});

$gift_form.submit(function(event) {
  event.preventDefault();
  gift_submit();
  //go get Amazon working

});

// if "enter" key pressed in cheep box, send new cheep
$('textarea').keypress(function(event) {

  if (event.keyCode == 13) {
    event.preventDefault();
    newcheep();
  }
});

$("div#feed").on("click", "button.delete", deletehandler);

$("div#users").on("click", "div.usernamedisp", highlightcheeps);

$("div#users").on("click", "div#clearuserhl", unhighlightcheeps);

$("nav li#signout").on("click", logouthandler);

// User Functions

// hide delete buttons
var yourdeletebuttons = function(uid) {
  var searchstring = "button.delete:not([uid=" + uid + "])";
  $(searchstring).hide();
};

// hide cheep entry
var canyoucheep = function(username) {
  if (username === "None") {
    $("div.newcheep").remove();
  }
};

// hide sign out button if no user
var canyouso = function(username) {
  if (username === "None") {
    $('nav li#signout').remove();
  } else {
    $('nav li#signin').remove();
  }
};

yourdeletebuttons(currentuserid);
canyoucheep(currentuser);
canyouso(currentuser);
