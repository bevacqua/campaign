'use strict';

// process.env.MANDRILL_APIKEY = '<redacted>';

var campaign = require('../campaign.js');
var client = campaign({
    from: 'ilmar.tyrk@gmail.com',
    trap: 'ilmar.tyrk@gmail.com',
    mandrill: { debug: true }
});

var template = '<p>Some {{data}}</p>';
var model = {
    to: 'foo@bar.com',
    subject: 'Awesome Things',
    data: 'interesting stuff'
};
client.sendString(template, model).then(function() {
    console.log('Done!');
});
