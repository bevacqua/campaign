'use strict';

var moment = require('moment');

module.exports = function (options) {
  function getCallback (model, done) {
    return function callback (err, html) {
      if (err) { return done(err); }

      model.generated = moment().format(model.when);
      model.body = html;

      var layoutModel = {
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
        unsubscribe: model.provider && model.provider.merge ? '{{{unsubscribe_html}}}' : ''
      };
      options.templateEngine.render(model.layout || options.layout, layoutModel, done);
    };
  }

  return {
    render: function (file, model, done) {
      options.templateEngine.render(file, model, getCallback(model, done));
    },
    renderString: function (template, model, done) {
      options.templateEngine.renderString(template, model, getCallback(model, done));
    }
  };
};
