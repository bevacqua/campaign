'use strict';

// process.env.MANDRILL_APIKEY = '<redacted>';

var campaign = require('../campaign.js');
var client = campaign({
    from: 'nicolasbevacqua@gmail.com',
    trap: 'nicolasbevacqua@gmail.com',
    mandrill: { debug: true }
});

var template = '<p>Some {{data}}</p>';
var model = {
    to: 'foo@bar.com',
    subject: 'Awesome Things',
    data: 'interesting stuff'
};
client.sendString(template, model, done);

function done (err, response) {
    console.log('Done!', err, response);
}
