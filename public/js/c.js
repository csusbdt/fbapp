(function() {
  window.app = window.app || {};
  app.c = {};

  app.c.login = function(cb) {
    FB.login(function(response) {
      if (response.authResponse) {
        console.log('?uid=' + response.authResponse.userID);
        console.log('&token=' + response.authResponse.accessToken);
        cb();
      } else {
        cb('Login failed.');
      }
    });
  };

  // app.c.init is called when asynch loading of js is complete
  app.c.init = function(facebookAppId) {
    FB.init({
      appId      : facebookAppId,
      channelUrl : '://' + window.location.host + '/channel.html',
      status     : false,  // check the login status upon init?
      cookie     : false,  // set sessions cookies?
      xfbml      : false  
    });
    FB.Canvas.setAutoGrow();
    FB.getLoginStatus(function(response) {
      if (response.status === 'connected') {
        console.log('?uid=' + response.authResponse.userID);
        console.log('&token=' + response.authResponse.accessToken);
        app.v.transitionTo('title');
      } else {
        app.v.transitionTo('login');
      }
    });
  };

  fbAsyncInit();

}());

