'use strict';

var path = require('path');
var mandrillSender = require('./src/mandrillSender.js');

function api (options) {
    if (!options.client) {
        options.client = mandrillSender(options);
    }
    if (!options.layout) {
        options.layout = api.defaultLayout;
    }

    return require('./src/emailService.js')(options);
}

api.defaultLayout = path.join(__dirname, 'templates/layout.mu');

module.exports = api;
