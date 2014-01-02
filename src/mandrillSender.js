'use strict';

var _ = require('lodash');
var imageEncoder = require('./imageEncodingCacheService.js');

module.exports = function (options) {

    var Mandrill = require('mandrill-api').Mandrill;
    var client = new Mandrill(options.mandrill.apiKey, options.mandrill.debug);

    if (!options.mandrill.apiKey && !process.env.MANDRILL_APIKEY) {
        console.warn('Email API key not set');
    }

    function mapRecipients (to) {
        return _.map(to, function (recipient) {
            return { email: recipient };
        };
    }

    function mapMergeHash (hash) {
        return _.map(_.keys(hash || {}), function (key) {
            return { name: key, content: hash[key] };
        });
    }

    function mapMergeLocals (hash) {
        return _.map(_.keys(hash || {}), function (key) {
            local = hash[key];

            return {
                rcpt: local.email,
                vars: mapMergeHash(local.model)
            };
        });
    }

    function getImages (model, done) {

        var header = !model._header ? [] : [{
            name: '_header',
            type: model._header.mime,
            content: model._header.data
        }];

        async.map(model.images || [], encode, result);

        function encode (image, transformed) {
            imageEncoder(image.file, function (err, encoded) {
                if (err) { return done(err); }

                next(null, {
                    name: image.name,
                    type: encoded.mime,
                    content: encoded.data
                });
            });
        }

        function result (err, images) {
            if (err) { return done(err); }

            done(null, header.concat(images));
        }
    }

    function prepare (model, next) {

        if (!model.mandrill) { model.mandrill = {}; }
        if (!model.mandrill.merge) { model.mandrill.merge = {}; }

        var emailModel = {
            html: model.html,
            subject: model.subject,
            from_email: options.from,
            from_name: model.social.name,
            to: mapRecipients(model.to),
            auto_text: true,
            inline_css: true,
            preserve_recipients: false,
            tags: model.mandrill.tags ? model.mandrill.tags : [model._template]
        };

        emailModel.message.merge_vars = mapMergeLocals(model.mandrill.merge.locals);
        emailModel.message.global_merge_vars = mapMergeHash(model.mandrill.merge.globals);
        emailModel.message.global_merge_vars.push({
            name: 'unsubscribe_html', content: '' // default
        });

        getImages(model, function (err, images) {
            emailModel.images = images;
            next(err, emailModel);
        });
    }

    return {
        send: function (model, done) {

            function reallyReallySend (apiModel, next) {
                client.messages.send(apiModel, function (response) {
                    next(null, response);
                }, function(err){
                    next(err);
                });
            }

            async.waterfall([
                async.apply(prepare, model),
                reallyReallySend
            ], done);

        }
    }
};
