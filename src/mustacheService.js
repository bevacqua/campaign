'use strict';

var mustache = require('mustache');
var path = require('path');
var fs = require('fs');
var cache = {};

function read (file, done) {
    if (file in cache) {
        return process.nextTick(next);
    }

    fs.readFile(file, { encoding: 'utf8' }, function (err, template) {
        if (err) {
            done(err);
        } else {
            cache[file] = mustache.compile(template);
            next();
        }
    });

    function next () {
        done(null, cache[file]);
    }
}

module.exports = {
    render: function (file, model, done) {
        read(file, function (err, fn) {
            if (err) {
                done(err);
            } else {
                done(null, fn(model));
            }
        });
    },
    renderString: function (template, model, done) {
        var fn = mustache.compile(template);
        done(null, fn(model));
    }
};
