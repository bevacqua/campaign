'use strict';

module.exports = function () {

    return {
        send: function (model, done) {

            console.log(JSON.stringify(model, null, 2));
            done();

        }
    };
};
