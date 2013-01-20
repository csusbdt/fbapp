$(function() {
  window.app = window.app || {};
  app.v = {};

  var currentScreen,
      screens = {};

  app.v.transitionTo = function(screenName) {
    var $oldScreenDiv, 
        $newScreenDiv;
    currentScreen = screens[screenName];
    $oldScreenDiv = $('.screen');
    $newScreenDiv = $('<div class="screen"></div>').hide();
    $('#screenContainer').append($newScreenDiv);
    $oldScreenDiv.fadeOut(300, function() {
      $oldScreenDiv.remove();
      $newScreenDiv.fadeIn(300);
    });
    currentScreen.build($newScreenDiv);
  }; 

  // loading screen
  currentScreen = screens.loading = {};

  // login screen
  screens.login = {};
  screens.login.build = function($screenDiv) {
    var $btn = $('<button id="login">Login</button>');
    $btn.click(function() {
      app.c.login(function(errMsg) {
        if (errMsg) alert(errMsg);
        else app.v.transitionTo('title');
      });
    });
    $screenDiv.append($btn);
  };

  // title screen
  screens.title = {};
  screens.title.build = function($screenDiv) {
    $screenDiv.append('You are logged into the app.');
  };

  fbAsyncInit();
});

