'use strict';

var ultramarked = require('ultramarked');
var htmlmd = require('html-md');
var options = {
  terminal: true
};

module.exports = function () {

    return {
        send: function (model, done) {
            var body = model.body;

            delete model.social;
            delete model.styles;
            delete model.html;
            delete model.body;
            delete model.generated;

            var md = htmlmd(body);
            var term = ultramarked(md, options);

            // console.log(JSON.stringify(model, null, 2));
            console.log(term);
            done();
        }
    };
};
