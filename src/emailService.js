'use strict';

var async = require('async');

function service (options) {

    var templateService = require('./templateService.js')(options);
    var hydrate = require('./hydrationService.js');

    function renderer (render, template, model, send, done) {

        function updateModel (html, next) {
            model.html = html;
            next();
        }

        function providerSend (next) {
            if (send) {
                options.provider.send(model, next);
            } else {
                next();
            }
        }

        var validation = require('./validationService.js')(model.trap || options.trap);
        var file = render === templateService.render ? template : null;

        async.series({
            validation: async.apply(validation, model),
            hydration: async.apply(hydrate, file, model, options),
            update: async.apply(async.waterfall, [
                async.apply(render, template, model),
                updateModel
            ]),
            response: providerSend
        }, function (err, results) {
            if (err) {
                done(err);
            } else if (send) {
                done(null, results ? results.response : results);
            } else {
                done(null, model.html, model);
            }
        });
    }

    return {
        send: function (file, model, done) {
            renderer(templateService.render, file, model, true, done);
        },
        sendString: function (template, model, done) {
            renderer(templateService.renderString, template, model, true, done);
        },
        render: function (file, model, done) {
            renderer(templateService.render, file, model, false, done);
        },
        renderString: function (template, model, done) {
            renderer(templateService.renderString, template, model, false, done);
        }
    };
}

module.exports = service;
