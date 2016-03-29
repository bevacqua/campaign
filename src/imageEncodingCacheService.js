'use strict';

var fs = require('fs');
var mime = require('mime');
var cache = {};

module.exports = function (file, done) {
  if (file in cache) {
    next(); return;
  }
  if (!file) {
    done(); return;
  }

  fs.readFile(file, read);

  function read (err, data) {
    if (err) {
      done(err); return;
    }
    cache[file] = {
      data: new Buffer(data).toString('base64'),
      mime: mime.lookup(file)
    };
    next();
  }

  function next () {
    done(null, cache[file]);
  }
};
