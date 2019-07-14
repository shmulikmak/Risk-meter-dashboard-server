
const { merge } = require('lodash');
const defaultConfig = require('./default');

// Set application config by node env
if (defaultConfig.isProd) {
    module.exports = merge(defaultConfig, require('./production'));
} else {
    module.exports = merge(defaultConfig, require('./development'));
}
