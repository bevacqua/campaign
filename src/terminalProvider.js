'use strict';


module.exports = function terminal (modelMapper) {
  return {
    name: 'terminal',
    send: function (model) {
      const modelBits = modelMapper ? modelMapper(model) : model

      console.log(JSON.stringify(modelBits, null,2), '\n');

      console.log(model.html);
      return true;
    }
  };
};