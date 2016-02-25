'use strict';

var contra = require('contra');

function service (options) {
  var templateService = require('./templateService.js')(options);
  var hydrate = require('./hydrationService.js');

  return {
    send: function (file, model, done) {
      renderer(templateService.render, file, model, true, done);
    },
    sendString: function (template, model, done) {
      renderer(templateService.renderString, template, model, true, done);
    },
    render: function (file, model, done) {
      renderer(templateService.render, file, model, false, done);
    },
    renderString: function (template, model, done) {
      renderer(templateService.renderString, template, model, false, done);
    }
  };

  function renderer (render, template, model, send, done) {
    var trap = model.trap || options.trap;
    var validation = require('./validationService.js')(trap);
    var file = render === templateService.render ? template : null;

    contra.series({
      validation: contra.curry(validation, model),
      hydration: contra.curry(hydrate, file, model, options),
      update: contra.curry(contra.waterfall, [
        contra.curry(render, template, model),
        updateModel
      ]),
      response: providerSend
    }, function (err, results) {
      if (err) {
        done(err);
      } else if (send) {
        done(null, results ? results.response : results);
      } else {
        done(null, model.html, model);
      }
    });

    function updateModel (html, next) {
      model.html = tweak(formatting(html));
      next();
    }

    function formatting (html) {
      return options.formatting ? options.formatting(html) : html;
    }

    function tweak (html) {
      if (trap) { // don't annoy trap recipient with weird glyphs
        return html;
      }
      var rtweaker = /(\{{2,})([\w._-]+)(\}{2,})/g;
      if (options.provider.tweakPlaceholder) {
        return html.replace(rtweaker, tweaker);
      }
      return html;
    }
    function tweaker (all, left, content, right) {
      var raw = left.length === 3 && right.length === 3;
      return options.provider.tweakPlaceholder(content, raw);
    }
    function providerSend (next) {
      if (send) {
        options.provider.send(model, next);
      } else {
        next();
      }
    }
  }
}

module.exports = service;
