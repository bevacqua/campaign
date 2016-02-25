'use strict';

var async = require('async');

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
    var validation = require('./validationService.js')(model.trap || options.trap);
    var file = render === templateService.render ? template : null;

    async.series({
      validation: async.apply(validation, model),
      hydration: async.apply(hydrate, file, model, options),
      update: async.apply(async.waterfall, [
        async.apply(render, template, model),
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
      model.html = html;
      if (options.provider.tweakPlaceholder) {
        model.html = model.html.replace(/(\{{2,})([\w._-]+)(\}{2,})/g, tweaker);
      }
      next();

      function tweaker (all, left, content, right) {
        var raw = left.length === 3 && right.length === 3;
        return options.provider.tweakPlaceholder(content, raw);
      }
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
