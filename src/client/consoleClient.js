'use strict';

var _ = require('lodash');
var async = require('async');
var imageEncoder = require('./imageEncodingCacheService.js');

module.exports = function (options) {

    return {
        send: function (model, done) {

            console.log(JSON.stringify(model, null, 2));
            done();

        }
    };
};
