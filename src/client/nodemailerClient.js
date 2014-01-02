'use strict';

var _ = require('lodash');

module.exports = function (options) {

    if (!options.transform) {
        options.transform = function () {};
    }

    return {
        send: function (model, done) {

            var message = {
                to: model.to.join(', '),
                subject: model.subject,
                html: model.html,
                generateTextFromHTML: true
            };

            options.transform(message);
            options.transport.sendMail(message, done);
        }
    };
};
