'use strict';

var _ = require('lodash');

module.exports = function (options) {

    if (!options.transform) {
        options.transform = function () {};
    }

    return {
        name: 'nodemailer',
        send: function (model, done) {

            var message = {
                from: model.from,
                to: model.to.join(', '),
                subject: model.subject,
                html: model.html,
                generateTextFromHTML: true
            };
            var transformed = options.transform(message);

            options.transport.sendMail(transformed || message, done);
        }
    };
};
