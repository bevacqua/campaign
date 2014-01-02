'use strict';

var async = require('async');
var path = require('path');
var fs = require('fs');
var emailTemplateService = require('./emailTemplateService.js');
var imageEncoder = require('./imageEncodingCacheService.js');

function service (options) {

    var validation = require('./validationService.js')(options.trap);

    return {
        send: function (template, model, done) {

            function encode (next) {
                imageEncoder(options.headerImage, function (err, result) {
                    model._header = result;
                    next(err);
                });
            }

            function filename (file) {
                var basename = path.basename(file);
                var lio = basename.lastIndexOf('.');
                return lio === -1 ? basename : basename.substr(0, lio);
            }

            function updateModel (html, next) {
                model.html = html;
                model._template = filename(template);

                if (!model.social) {
                    model.social = {};
                }

                next();
            }

            function reallyReallySend (next) {
                options.client.send(model, next);
            }

            async.waterfall([
                async.apply(validation, model),
                encode,
                async.apply(templateService.render, template, model),
                updateModel,
                reallyReallySend
            ], done);
        }
    };
};

module.exports = service;
