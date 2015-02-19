'use strict';

var htmlmd = require('html-md');
var marked = require('marked');
var TerminalRenderer = require('marked-terminal');
var options = {
  renderer: new TerminalRenderer()
};

module.exports = function () {

    return {
        name: 'terminal',
        send: function (model, done) {
            var body = model.body;

            delete model.social;
            delete model.styles;
            delete model.html;
            delete model.body;
            delete model.generated;

            var md = htmlmd(body);
            var term = marked(md, options);

            console.log(JSON.stringify(model, null, 2));
            console.log(term);
            done();
        }
    };
};
