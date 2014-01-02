'use strict';

var fs = require('fs');
var mime = require('mime');
var cache = {};

module.exports = function (file, done) {
    if (file in cache) {
        return next();
    }

    if (!file) {
        return done();
    }

    fs.readFile(file, function(err, data){
        if (err) {
            return done(err);
        }
        cache[file] = {
            data: new Buffer(data).toString('base64'),
            mime: mime.lookup(file)
        };
        next();
    });

    function next () {
        done(null, cache[file]);
    }
};
