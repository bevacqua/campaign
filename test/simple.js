'use strict';

var campaign = require('../campaign.js');
var client = campaign({
    provider: campaign.providers.terminal()
});
var template = '<p>Your password reset key is: {{reset}}</p>';
var model = {
    to: 'someone@important.com',
    subject: 'Password Reset',
    reset: 'q12jFbwJsCKm'
};

client.sendString(template, model, done);

function done () {
  console.log('Done.');
}
