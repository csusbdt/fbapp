var http        = require('http');

var req_home    = require('./req_home');
var req_memfile = require('./req_memfile');

var router      = require('./router');

var model       = require('./model');
var fb          = require('./fb');

// TODO(turner) minify js and css as part of deployment process

// MAYBE IMPORTANT: See the following for fixes to character set conversion issues.
// https://gist.github.com/2024272
// http://ecmanaut.blogspot.com/2006/07/encoding-decoding-utf8-in-javascript.html

// http://www.smashingboxes.com/heroku-vs-amazon-web-services/
// See http://policy.heroku.com/aup for limits on RAM and storage
// For caching files, use http://nodejs.org/api/process.html#process_process_memoryusage
// to check for 512 MB memory limit.

// See the following for performance tips.
// http://engineering.linkedin.com/nodejs/blazing-fast-nodejs-10-performance-tips-linkedin-mobile

// Refer to following for caching
// https://devcenter.heroku.com/articles/increasing-application-performance-with-http-cache-headers
// Maybe add ETags.  See the following:
//    http://en.wikipedia.org/wiki/HTTP_ETag
//    https://github.com/tomgco/gzippo/blob/master/lib/staticGzip.js

// For slug size, see https://devcenter.heroku.com/articles/slug-compiler
// See https://devcenter.heroku.com/articles/s3 for asset storage

// Heroku uses varnish to cache content.  See
// http://stackoverflow.com/questions/5278206/heroku-spin-up.

if (process.env.FACEBOOK_APP_ID === undefined) throw new Error('FACEBOOK_APP_ID not defined');
if (process.env.FACEBOOK_SECRET === undefined) throw new Error('FACEBOOK_SECRET not defined');
if (process.env.MONGO_URI       === undefined) throw new Error('MONGO_URI not defined');
if (process.env.PORT            === undefined) throw new Error('PORT not defined');

// Remove spaces that foreman does not take out.
process.env.FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID.replace(' ', '');
process.env.FACEBOOK_SECRET = process.env.FACEBOOK_SECRET.replace(' ', '');
process.env.MONGO_URI = process.env.MONGO_URI.replace(' ', '');
process.env.PORT = process.env.PORT.replace(' ', '');

// Allow node to cache a lot of socket connections to Facebook.
http.globalAgent.maxSockets = Infinity;

// Run 4 initialization routines in parallel.
var n = 4;
/*
function onEnd(err) {
  if (err instanceof Error) {
    console.log(err.message);
    n = -1;
  } else {
    if (--n === 0) router.start();
  }
}
*/

function onEnd() {
  if (--n === 0) router.start();
}

req_memfile.init(onEnd);
req_home.init(onEnd);
model.init(onEnd);
fb.init(onEnd);
