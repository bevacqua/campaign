'use strict';

var path = require('path');
var emailService = require('./src/emailService.js');

function api (options) {
  options.layout = options.layout || options.templateEngine.defaultLayout;
  return emailService(options);
}

module.exports = api;
