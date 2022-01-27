'use strict';

// process.env.MANDRILL_APIKEY = '<redacted>';

const path = require('path');
const campaign = require('../campaign.js');
const client = campaign({
    from: 'ilmar.tyrk@gmail.com',
    trap: 'ilmar.tyrk@gmail.com',
    mandrill: { debug: true }
});

const template = '<p>Some {{data}}</p><p><img src="cid:IMAGE" /></p>';
const model = {
    to: 'foo@bar.com',
    subject: 'Awesome Things',
    data: 'interesting stuff',
    images: [{name:'IMAGE',file:path.resolve('../resources/campaign.png')}]
};
client.sendString(template, model).then(function (response) {
    console.log('DONE', response);
}).catch(function (err) {
    console.log('ERROR', err)
})


