'use strict';

var _ = require('lodash');
var path = require('path');
var async = require('async');
var encode = require('./imageEncodingCacheService.js');

function filename (file) {
    var basename = path.basename(file);
    var lio = basename.lastIndexOf('.');
    return lio === -1 ? basename : basename.substr(0, lio);
}

function cacheHeader (model, header, next) {
    encode(header, function (err, result) {
        model._header = result;
        next(err);
    });
}

function encodeImages (model, next) {
    async.map(model.images || [], encoder, function (err, images) {
        model.images = images;
        next(err);
    });
}

function encoder (image, transformed) {
    encode(image.file, function (err, encoded) {
        if (err) { return transformed(err); }

        transformed(null, {
            name: image.name,
            type: encoded.mime,
            content: encoded.data
        });
    });
}

module.exports = function (template, model, header, done) {

    var defaultStyles = require('./dat/defaultStyles.json');

    if (model.styles) {
        model.styles = _.merge({}, defaultStyles, model.styles);
    } else {
        model.styles = defaultStyles;
    }

    if (!model.social) {
        model.social = {};
    }

    model._template = template ? filename(template) : '(dynamic)';

    async.parallel([
        async.apply(cacheHeader, model, header),
        async.apply(encodeImages, model)
    ], done);
};
