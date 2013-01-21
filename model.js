var fb          = require('./fb');
var MongoClient = require('mongodb').MongoClient;
var Server      = require('mongodb').Server;

// A good starting point:
//     https://github.com/mongodb/node-mongodb-native/blob/master/docs/database.md

// Main doc: 
//    http://mongodb.github.com/node-mongodb-native/contents.html

/////////////////////////////////////////////////////////////////////////////////
//
// How this module is patterned:
//
// The functions in this module take incomplete user objects as input.
//
// The uid property of the user object is mapped to _id in the database.
//
// The get functions use the uid from the user object to get one
// or more properties from the database, and then adds these properties to 
// the user object.
//
// The save functions use the uid and one or more properties from the
// user object, and writes these into the database.
//
// The callback functions all have the same signature: function(err), where
// err will be undefined or an instance of Error.
//
/////////////////////////////////////////////////////////////////////////////////

// WARNING: mongo does not use type coercion in many places, 
//          so use exact types in function arguments.

var host   = process.env.MONGO_HOST;
var port   = parseInt(process.env.MONGO_PORT, 10);
var dbName = process.env.MONGO_DB;

var serverOptions = {
  auto_reconnect: true, 
  poolSize: 20
};

var dbOptions = {
  retryMiliSeconds: 5000, 
  numberOfRetries: 4,
  w: 1
};

var server = new Server(host, port, serverOptions);
var client = new MongoClient(server, dbOptions);

// Make sure we can connect to database.
// Throw any error to halt program.
exports.init = function(cb) {
  client.open(function(err, db) {
    if (err) throw err;
    db.close(); 
    cb();
  }); 
};

// Input: user.uid
// Reads: user.secret, user.expires
exports.getSecret = function(user, cb) {
  client.open(function(err, db) {
    if (err) return cb(err);
    db.collection('users').findOne(
      { _id: user.uid }, 
      { secret: 1, expires: 1, _id: 0 }, 
      function(err, dbUser) {
        db.close();
        if (err) return cb(err); 
        if (dbUser) {
          user.secret = dbUser.secret;
          user.expires = dbUser.expires;
        } else {
          console.log('WARNING: user not found');
        }
        cb();
      }
    );
  });
};

// Input: user.uid, user.secret, user.expires
// Writes: user.secret, user.expires
// Note: This function creates user documents when needed.
exports.saveSecret = function(user, cb) {
  client.open(function(err, db) {
    if (err) return cb(err);
    db.collection('users').update(
      { _id: user.uid }, 
      { $set: { secret: user.secret, expires: user.expires } },
      { safe: true, upsert: true },
      function(err) {
        db.close();
        if (err) return cb(err); 
        cb();
      }
    );
  });
};

// Input: user.uid
// Reads: user.appState
exports.getAppState = function(user, cb) {
  client.open(function(err, db) {
    if (err) return cb(err);
    db.collection('users').findOne(
      { _id: user.uid }, 
      { appState: 1, _id: 0 }, 
      function(err, dbUser) {
        db.close();
        if (err) return cb(err);
        if (dbUser.appState) {
          user.appState = dbUser.appState;
        } else {
          // if app state missing, then use implicit app state
          user.appState = { number: 0 }
        }
        cb();
      }
    );
  });
};

// Input: user.uid, user.appState
// Writes: user.appState
exports.saveAppState = function(user, cb) {
  client.open(function(err, db) {
    if (err) return cb(err);
    db.collection('users').update(
      { _id: user.uid }, 
      { $set: { appState: user.appState } },
      { safe: true },
      function(err) {
        db.close();
        if (err) return cb(err);
        cb();
      }
    );
  });
};

