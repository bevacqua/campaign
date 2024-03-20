'use strict';

const emailService = require('./src/emailService.js');
const templateEngine = require('./src/templateEngine.js');
const terminal = require('./src/terminalProvider.js')();

function api (options) {
  options = options || {};
  if (!options.templateEngine) {
    options.templateEngine = templateEngine;
  }
  if (!options.provider) {
    options.provider = terminal;
  }
  options.layout = options.layout || options.templateEngine?.defaultLayout;

  return emailService(options);
}

module.exports = api;
