'use strict';

var moment = require('moment');

module.exports = function (engine, layout) {

    function getCallback (model, done) {

        return function callback (err, html) {
            if (err) { return done(err); }

            model.generated = moment().format(model.when);
            model.body = html;

            var layoutModel = {
                _header: !!model._header,
                subject: model.subject,
                teaser: model.teaser,
                generated: model.generated,
                body: model.body,
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
