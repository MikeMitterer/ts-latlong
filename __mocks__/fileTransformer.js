const path = require('path');

// Wird von JEST benötigt (jest.config.js)
module.exports = {
    process(src, filename, config, options) {
        return 'module.exports = ' + JSON.stringify(path.basename(filename)) + ';';
    },
};
