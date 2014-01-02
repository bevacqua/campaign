'use strict';

var moment = require('moment');
var mustacheService = require('./mustacheService.js');

module.exports = function (layout) {

    function getCallback (model, done) {

        return function callback (err, html) {
            if (err) { return done(err); }

            var when = moment().format('YYYY/MM/DD HH:mm, UTC Z');
            var layoutModel = {
                _header: !!model._header,
                subject: model.subject,
                preview: model.preview,
                generated: when,
                body: html,
                trapped: model.trapped,
                social: model.social,
                styles: model.styles
            };

            mustacheService.render(layout, layoutModel, done);
        };
    }

    return {
        render: function (file, model, done) {
            mustacheService.render(file, model, getCallback(model, done));
        },
        renderString: function (template, model, done) {
            mustacheService.renderString(template, model, getCallback(model, done));
        }
    };
};
