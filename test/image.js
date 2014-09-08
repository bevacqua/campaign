'use strict';

// process.env.MANDRILL_APIKEY = '<redacted>';

var path = require('path');
var campaign = require('../campaign.js');
var client = campaign({
    from: 'nicolasbevacqua@gmail.com',
    trap: 'nicolasbevacqua@gmail.com',
    mandrill: { debug: true }
});

var template = '<p>Some {{data}}</p><p><img src="cid:IMAGE" /></p>';
var model = {
    to: 'foo@bar.com',
    subject: 'Awesome Things',
    data: 'interesting stuff',
    images: [{name:'IMAGE',file:path.resolve('./resources/campaign.png')}]
};
client.sendString(template, model, done);

function done (err, response) {
    console.log('Done!', err, response);
}
