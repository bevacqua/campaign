'use strict';

var moment = require('moment');
var mustacheService = require('./mustacheService.js');

module.exports = {
    render: function(template, model, done){

        mustacheService.render(template, model, function (err, html) {
            if (err) { return done(err); }

            var when = moment().format('YYYY/MM/DD HH:mm, UTC Z');
            var message = {
                _header: !!model._header,
                subject: model.subject,
                preview: model.preview,
                generated: when
                body: html,
                trapped: model.trapped,
                social: model.social
            };

            mustacheService.render(options.layout, message, done);
        });
    }
};
