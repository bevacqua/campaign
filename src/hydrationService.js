'use strict';

const path = require('path');
const encode = require('./imageEncodingCacheService.js');
const defaultStyles = require('./defaultStyles.json');

function filename (file) {
  const basename = path.basename(file);
  const lio = basename.lastIndexOf('.');
  return lio === -1 ? basename : basename.substring(0, lio);
}

async function cacheHeader (model, header) {
  model._header = await encode(header);
}

async function encodeImages (model) {
  if (model.images?.length) {
    model.images = model.images.map((image) => {
      return encoder(image);
    })
  }
}

async function encoder (image) {
  if (image.data && image.mime) {
    return image;
  }
  const encoded = await encode(image.file);

  return {
    name: image.name,
    mime: encoded.mime,
    data: encoded.data
  };
}

module.exports = async function (template, model, options) {
  if (model.styles) {
    model.styles = Object.assign(defaultStyles, model.styles);
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
  await cacheHeader(model, model.headerImage || options.headerImage);

  return encodeImages(model);
};
