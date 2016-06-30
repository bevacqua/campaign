'use strict';

module.exports = function (trap) {
  function getRecipientsTitle (recipients) {
    if (!recipients.length) {
      return 'nobody!';
    }
    if (recipients.length === 1) {
      return recipients[0];
    }
    return recipients.length + ' recipients';
  }

  function validateModel (model, done) {
    if (!model.to) { return done(new Error('Recipients missing in email')); }
    if (!model.subject) { return done(new Error('Subject missing in email')); }
    if (!model.teaser) { model.teaser = model.subject; }
    if (typeof model.to === 'string') { model.to = [model.to]; }
    if (typeof model.cc === 'string') { model.cc = [model.cc]; }
    if (typeof model.bcc === 'string') { model.bcc = [model.bcc]; }
    if (!Array.isArray(model.to)) { model.to = []; }
    if (!Array.isArray(model.cc)) { model.cc = []; }
    if (!Array.isArray(model.bcc)) { model.bcc = []; }

    if (trap) {
      model.subject += ' - to: ' + getRecipientsTitle(model.to.concat(model.cc).concat(model.bcc));
      model.trapped = JSON.stringify(readTrapped(), null, 2);
      model.to = typeof trap === 'string' ? [trap] : [];
      model.cc = [];
      model.bcc = [];
    }

    done();

    function readTrapped () {
      return {
        to: model.to,
        cc: model.cc,
        bcc: model.bcc,
        merge: model.provider && model.provider.merge || []
      };
    }
  }

  return validateModel;
};
