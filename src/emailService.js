'use strict';

function service (options) {
  const templateService = require('./templateService.js')(options);
  const hydrate = require('./hydrationService.js');

  return {
    send: async function (file, model) {
      return renderer(templateService.render, file, model, true);
    },
    sendString: async  function (template, model) {
      return renderer(templateService.renderString, template, model, true);
    },
    render: async  function (file, model) {
      return renderer(templateService.render, file, model, false);
    },
    renderString: async  function (template, model) {
      return renderer(templateService.renderString, template, model, false);
    }
  };

  async function renderer (render, template, model, send) {
    const trap = model.trap || options.trap;
    const validation = require('./validationService.js')(trap);
    const file = render === templateService.render ? template : null;
    await validation(model);
    await hydrate(file, model, options);
    const html = await render(template, model);
    await updateModel(html);
    const response = providerSend();

    if (send) {
      return response;
    } else {
      return model.html;
    }

    async function updateModel (html) {
      model.html = tweak(formatting(html));
    }

    function formatting (html) {
      return options.formatting ? options.formatting(html) : html;
    }

    function tweak (html) {
      if (trap) { // don't annoy trap recipient with weird glyphs
        return html;
      }
      const rtweaker = /(\{{2,})([\w._-]+)(\}{2,})/g;
      if (options.provider.tweakPlaceholder) {
        return html.replace(rtweaker, tweaker);
      }
      return html;
    }
    function tweaker (all, left, content, right) {
      const raw = left.length === 3 && right.length === 3;
      return options.provider.tweakPlaceholder(content, raw);
    }
    function providerSend () {
      if (send && options.provider) {
        return options.provider.send(model);
      }
    }
  }
}

module.exports = service;
