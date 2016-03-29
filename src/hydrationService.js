'use strict';

var assign = require('assignment');
var path = require('path');
var contra = require('contra');
var encode = require('./imageEncodingCacheService.js');
var defaultStyles = require('./defaultStyles.json');

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
  contra.map(model.images || [], encoder, function (err, images) {
    model.images = images;
    next(err);
  });
}

function encoder (image, transformed) {
  if (image.data && image.mime) {
    transformed(null, image); return;
  }
  encode(image.file, function (err, encoded) {
    if (err) {
      transformed(err); return;
    }
    transformed(null, {
      name: image.name,
      mime: encoded.mime,
      data: encoded.data
    });
  });
}

module.exports = function (template, model, options, done) {
  if (model.styles) {
    model.styles = assign({}, defaultStyles, model.styles);
  } else {
    model.styles = defaultStyles;
  }
  if (!model.social) {
    model.social = {};
  }
  if (!model.when) {
    model.when = 'YYYY/MM/DD HH:mm, UTC Z';
  }
  if (!model.from) {
    model.from = options.from;
  }

  model._template = template ? filename(template) : '(dynamic)';

  contra.concurrent([
    contra.curry(cacheHeader, model, 'headerImage' in model ? model.headerImage : options.headerImage),
    contra.curry(encodeImages, model)
  ], done);
};
