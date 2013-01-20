$(function() {
  window.app = window.app || {};
  app.v = {};

  var currentScreen,
      screens = {};

  var transitionTo = app.v.transitionTo = function(screenName) {
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
    $screenDiv.load('home/login.html' +'?'+Math.random());
  };

  // title screen
  screens.title = {};
  screens.title.build = function($screenDiv) {
    $screenDiv.load('home/title.html' +'?'+Math.random());
  };

  // number screen
  screens.number = {};
  screens.number.build = function($screenDiv) {
    $screenDiv.load('home/number.html' +'?'+Math.random());
  };

  fbAsyncInit();
});

