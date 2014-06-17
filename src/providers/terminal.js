'use strict';

var hermit = require('hermit');
var options = {
    listIndent: '    ',
    listStyle: '* ',
    stylesheet: {
        h1: 'white',
        a: 'underline',
        parent: {}
    }
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

            console.log(JSON.stringify(model, null, 2));

            hermit(body, options, function (err, result) {
              console.log(result);
              done();
            });
        }
    };
};
