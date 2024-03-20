'use strict';

const fs = require('fs/promises');
const path = require('path');
const mime = require('mime');
const cache = {};

module.exports = async function (file) {
  if (file in cache) {
    return cache[file];
  }
  if (!file) {
    return;
  }

  try {
    const data = await fs.readFile(path.resolve(file));
    cache[file] = {
      data: Buffer.from(data).toString('base64'),
      mime: mime.getType(file)
    };

    return cache[file];
  } catch (err) {
    console.error(err);
  }

};
