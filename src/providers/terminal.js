'use strict';

var htmlmd = require('html-md');

module.exports = function () {

    return {
        send: function (model, done) {
            var body = model.body;

            delete model.social;
            delete model.styles;
            delete model.html;
            delete model.body;
            delete model.generated;

            console.log(JSON.stringify(model, null, 2));
            console.log(htmlmd(body));
            done();
        }
    };
};
