'use strict';

const moment = require('moment');
let options;
module.exports = function (opt) {
  options = opt;

  function renderTemplate (model, html) {
    model.generated = moment().format(model.when);
    model.body = html;

    const layoutModel = {
      _header: !!model._header,
      subject: model.subject,
      teaser: model.teaser,
      teaserHtml: model.teaserHtml,
      teaserRight: model.teaserRight,
      teaserRightHtml: model.teaserRightHtml,
      generated: model.generated,
      body: model.body,
      trapped: model.trapped,
      social: model.social,
      styles: model.styles,
      linkedData: model.linkedData,
      unsubscribe: model.provider && model.provider.merge ? '{{{unsubscribe_html}}}' : '',
      pixel: model.pixel
    };

    return options.templateEngine.render(model.layout || options.layout, layoutModel);
  };

  return {
    render: async function (file, model) {
      const html = await options.templateEngine.render(file, model);

      return renderTemplate(model, html);
    },
    renderString: async function (template, model) {
      const html = await options.templateEngine.renderString(template, model);

      return renderTemplate(model, html)
    }
  };
};
