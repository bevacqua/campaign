'use strict';

var async = require('async');

function service (options) {

    var templateService = require('./templateService.js')(options.layout);
    var validation = require('./validationService.js')(options.trap);
    var hydrate = require('./hydrationService.js');

    function renderer (render, file, model, done) {

        function updateModel (html, next) {
            model.html = html;
            next();
        }

        function clientSend (next) {
            options.client.send(model, next);
        }

        async.waterfall([
            async.apply(validation, model),
            async.apply(hydrate, file, model, options.headerImage),
            async.apply(render, model),
            updateModel,
            clientSend
        ], done);
    }

    return {
        send: function (file, model, done) {
            var render = templateService.render.bind(templateService, file);
            renderer(render, file, model, done);
        },
        sendString: function (template, model, done) {
            var render = templateService.renderString.bind(templateService, template);
            renderer(render, null, model, done);
        }
    };
}

module.exports = service;
