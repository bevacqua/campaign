'use strict';

var moment = require('moment');

module.exports = function (engine, layout) {

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

            engine.render(layout, layoutModel, done);
        };
    }

    return {
        render: function (file, model, done) {
            engine.render(file, model, getCallback(model, done));
        },
        renderString: function (template, model, done) {
            engine.renderString(template, model, getCallback(model, done));
        }
    };
};
