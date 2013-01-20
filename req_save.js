var querystring = require('querystring');
var model = require('./model');
var ajax = require('./ajax');

function error(res, err) {
  console.error('req_save: ' + err.message);
  res.end(500, { error: err.message });
}

// Process a request to save the app state.
exports.handle = function(req, res) {
  ajax.parse(req, function(data) {
    if (data instanceof Error) {
      console.log('req_save: failed to parse incoming data: ' + data.message);
      return ajax.error(res);
    }
    var user = {};
    if (data.uid === undefined) {
      console.log('req_save: uid missing from req: ' + JSON.stringify(data));
      return ajax.error(res);
    }
    if (data.secret === undefined) {
      console.log('req_save: secret missing from req: ' + JSON.stringify(data));
      return ajax.error(res);
    }
    if (data.appState === undefined) {
      console.log('req_save: appState missing from req: ' + JSON.stringify(data));
      return ajax.error(res);
    }
    user.uid = data.uid;
    model.getSecret(user, function(err) {
      if (err) {
        console.log('req_save: failed to get secret from db: ' + err.message);
        return ajax.error(res);
      }
      if (data.secret !== user.secret) {
        return ajax.reply(res, { login: true });
      }
      user.appState = data.appState;
      model.saveAppState(user, function(err) {
        if (err) {
          console.log('req_save: failed to save app state into db: ' + err.message);
          return ajax.error(res);
        }
        ajax.ok(res);
      });
    });
  });
};
