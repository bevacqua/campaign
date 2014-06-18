'use strict';

var ultramarked = require('ultramarked');
var htmlmd = require('html-md');

ultramarked.setOptions({
  smartLists: true,
  ultralight: true,
  ultrasanitize: true,
  terminal: true
});

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
            var term = ultramarked(md);

            console.log(JSON.stringify(model, null, 2));
            console.log(term);
            done();
        }
    };
};
