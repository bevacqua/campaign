'use strict';

var async = require('async');

function service (options) {

    var templateService = require('./templateService.js')(options.layout);
    var validation = require('./validationService.js')(options.trap);
    var hydrate = require('./hydrationService.js');

    return {
        send: function (template, model, done) {

            function updateModel (html, next) {
                model.html = html;
                next();
            }

            function clientSend (next) {
                options.client.send(model, next);
            }

            async.waterfall([
                async.apply(validation, model),
                async.apply(hydrate, template, model, options.headerImage),
                async.apply(templateService.render, template, model),
                updateModel,
                clientSend
            ], done);
        }
    };
}

module.exports = service;
