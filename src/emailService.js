'use strict';

var async = require('async');

function service (options) {

    var templateService = require('./templateService.js')(options);
    var hydrate = require('./hydrationService.js');

    function renderer (render, template, model, done) {

        function updateModel (html, next) {
            model.html = html;
            next();
        }

        function providerSend (next) {
            options.provider.send(model, next);
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
            done(err, results ? results.response : results);
        });
    }

    return {
        send: function (file, model, done) {
            renderer(templateService.render, file, model, done);
        },
        sendString: function (template, model, done) {
            renderer(templateService.renderString, template, model, done);
        }
    };
}

module.exports = service;
