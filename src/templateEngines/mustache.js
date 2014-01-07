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
            mustache.parse(template);
            cache[file] = template;
            next();
        }
    });

    function next () {
        done(null, cache[file]);
    }
}

module.exports = {
    defaultLayout: path.join(__dirname, 'layouts/layout.mu'),
    render: function (file, model, done) {
        read(file, function (err, template) {
            if (err) {
                done(err);
            } else {
                done(null, mustache.render(template, model));
            }
        });
    },
    renderString: function (template, model, done) {
        done(null, mustache.render(template, model));
    }
};
