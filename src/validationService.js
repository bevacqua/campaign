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

        if (trap) {
            model.subject += ' - to: ' + getRecipientsTitle(model.to);
            model.trapped = JSON.stringify({
                to: model.to || [],
                merge: model.mandrill && model.mandrill.merge || []
            }, null, 2);
            model.to = typeof trap === 'string' ? [trap] : [];
        }

        done();
    }

    return validateModel;
};
