var path = require('path');
var fs = require('fs/promises');
const cache = [];

async function read (file) {
    if (file in cache) {
      return process.nextTick(next);
    }

    const template = await fs.readFile(file, { encoding: 'utf8' });
    cache[file] = template;

    return template;
};

const render = (template, model) => {
    const keys = Object.keys(model);
    keys.forEach((key) => {
        template = template.replace(`{{${key}}}`, model[key]);
    })

    return template;
};

module.exports = {
    defaultLayout: path.join(__dirname, 'layout.txt'),
    render: async function (file, model) {
        const template = await read(file);

        return render(template, model)
    },
    renderString: async function (template, model) {
        return render(template, model);
    }
};