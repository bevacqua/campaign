'use strict';

var _ = require('lodash');
var async = require('async');

module.exports = function (options) {

    if (!options.mandrill) {
        options.mandrill = {};
    }

    var Mandrill = require('mandrill-api').Mandrill;
    var client = new Mandrill(options.mandrill.apiKey, options.mandrill.debug);

    if (!options.mandrill.apiKey && !process.env.MANDRILL_APIKEY) {
        console.warn('node_modules/campaign: Mandrill API key not set');
    }

    function mapRecipients (to) {
        return _.map(to, function (recipient) {
            return { email: recipient };
        });
    }

    function mapMergeHash (hash) {
        return _.map(_.keys(hash || {}), function (key) {
            return { name: key, content: hash[key] };
        });
    }

    function mapMergeLocals (hash) {
        return _.map(_.keys(hash || {}), function (key) {
            var local = hash[key];

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

        async.map(model.images || [], transform, result);

        function transform (image, transformed) {
            transformed(null, {
                name: image.name,
                type: image.mime,
                content: image.data
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

        var apiModel = {
            message: {
                html: model.html,
                subject: model.subject,
                from_email: model.from,
                from_name: model.social.name,
                to: mapRecipients(model.to),
                auto_text: true,
                inline_css: true,
                preserve_recipients: false,
                tags: model.mandrill.tags ? model.mandrill.tags : [model._template]
            }
        };

        apiModel.message.merge_vars = mapMergeLocals(model.mandrill.merge.locals);
        apiModel.message.global_merge_vars = mapMergeHash(model.mandrill.merge.globals);
        apiModel.message.global_merge_vars.push({
            name: 'unsubscribe_html', content: '' // default
        });

        getImages(model, function (err, images) {
            apiModel.message.images = images;
            next(err, apiModel);
        });
    }

    return {
        name: 'mandrill',
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
    };
};
