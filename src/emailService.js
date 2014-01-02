'use strict';

var async = require('async');

function service (options) {

    var templateService = require('./templateService.js')(options.layout);
    var validation = require('./validationService.js')(options.trap);
    var hydrate = require('./hydrationService.js');

    function renderer (render, template, model, done) {

        function updateModel (html, next) {
            model.html = html;
            next();
        }

        function clientSend (next) {
            options.client.send(model, next);
        }

        var file = render === templateService.render ? template : null;

        async.series([
            async.apply(validation, model),
            async.apply(hydrate, file, model, options),
            async.apply(async.waterfall, [
                async.apply(render, template, model),
                updateModel
            ]),
            clientSend
        ], done);
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
