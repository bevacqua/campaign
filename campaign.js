'use strict';

var path = require('path');
var emailService = require('./src/emailService.js');
var terminal = require('./src/providers/terminal.js');
var mandrill = require('./src/providers/mandrill.js');
var nodemailer = require('./src/providers/nodemailer.js');
var mustache = require('./src/templateEngines/mustache.js');

function api (options) {
    options.provider = options.provider || mandrill(options);
    options.templateEngine = options.templateEngine || mustache;
    options.layout = options.layout || options.templateEngine.defaultLayout;

    return emailService(options);
}

api.providers = {
    terminal: terminal,
    mandrill: mandrill,
    nodemailer: nodemailer
};

api.templateEngines = {
    mustache: mustache
};

module.exports = api;
