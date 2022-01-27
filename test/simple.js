'use strict';

const campaign = require('../campaign.js');
const client = campaign();
const template = '<p>Your <i>password reset key</i> is: <b>{{reset}}</b></p>';
const model = {
    to: 'someone@important.com',
    subject: 'Password Reset',
    reset: 'q12jFbwJsCKm'
};

client.sendString(template, model).then(function(response) {
  console.log('Done.', response);
});
