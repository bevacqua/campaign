'use strict';

var campaign = require('../campaign.js');
var client = campaign({
    client: campaign.clients.console()
});

var template = '<p>Some {{data}}</p>';
var model = {
    to: 'foo@bar.com',
    subject: 'Awesome Things',
    data: 'interesting stuff'
};
client.sendString(template, model, done);

function done () {
    console.log('Done!');
}
