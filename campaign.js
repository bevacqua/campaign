'use strict';

var path = require('path');
var emailService = require('./src/emailService.js');
var consoleProvider = require('./src/providers/console.js');
var mandrillProvider = require('./src/providers/mandrill.js');
var nodemailerProvider = require('./src/providers/nodemailer.js');

function api (options) {
    if (!options.provider) {
        options.provider = mandrillProvider(options);
    }
    if (!options.layout) {
        options.layout = api.defaultLayout;
    }

    return emailService(options);
}

api.defaultLayout = path.join(__dirname, 'templates/layout.mu');
api.providers = {
    console: consoleProvider,
    mandrill: mandrillProvider,
    nodemailer: nodemailerProvider
};

module.exports = api;
