$(document).ready(function () {
  $.material.init();
  $("input.currency").autoNumeric('init');
});

// facebook #_=_ fix
if (window.location.hash && window.location.hash == '#_=_') {
  window.location.hash = '';
}
if (window.location === '/#') {
  window.location = '/';
}

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

var amazon_page = function (money, searchindices) {
  $("div.titlebox h1").html('Please wait...');
  $("div#mainscroll").html('<i class="fa fa-spinner fa-pulse"></i>');

  $.post('/gift', {'money': money, 'searchindices': searchindices})
  .done(function (data, status) {
    // get result
    $("div.titlebox h1").html('Random Gift!');
    $("div#mainscroll").html(data);
  })
  .error(function (err, status) {
    console.error(err);
  });
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

$('form#giftconfig').submit(function (event) {
  event.preventDefault();

  var money = $("#desiredprice").val();
  var searchindices = $("#searchindex").val();

  var $searchinfo = $("div.row#searchinfo");

  $searchinfo.attr('searchindex', searchindices);
  $searchinfo.attr('desprice', money);

  $("form#giftconfig").remove();
  $("div.titlebox h1").html('Please wait...');
  $("div#mainscroll").html('<div id="spinner_holder"><br><br><br><div class="waiting-icon"><i class="fa fa-spinner fa-5x fa-pulse"></i></div></div>');

  $.post('/gift', {
      'money': money,
      'searchindices': searchindices
    })
    .done(function (data, status) {
      var result = $("div.row#hidden_result").attr("result");

      if (!result) {
        $("div#spinner_holder").remove();
        $("div.titlebox h1").html('');
        $("div#mainscroll").append("<h1>No Result</h1><br><br><br><br><br><br><br><br><button id='refresh' class='btn btn-default'>Try something else...</button>");
      } else {
        $("div.titlebox h1").html('We found...');
        $("div#mainscroll").html(data);
      };
    })
    .error(function (err, status) {
      console.error(err);
    });

});

// Product page

$("a#gotoamz").click(function (event) {
  location = '/';
});

$("div#mainscroll").on('click', 'button#retry', function (event) {

  var $searchinfo = $("div.row#searchinfo");

  var money = $searchinfo.attr('desprice');
  var searchindices = $searchinfo.attr('searchindex');

  $("div.titlebox h1").html('Trying again...');
  $("div#mainscroll").html('<div id="spinner_holder"><br><br><br><div class="waiting-icon"><i class="fa fa-spinner fa-5x fa-pulse"></i></div></div>');

  $.post('/gift', {
      'money': money,
      'searchindices': searchindices
    })
    .done(function (data, status) {
      $("div.titlebox h1").html('We found...');
      $("div#mainscroll").html(data);
    })
    .error(function (err, status) {
      console.error(err);
    });
});

$("div#mainscroll").on('click', 'button#refresh', function (event) {

  location.reload(); 

});