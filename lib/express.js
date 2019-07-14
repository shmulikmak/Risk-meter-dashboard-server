const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const bodyParser = require('body-parser');
const logger = require('./logger');
const config = require('../config/config');
const dataRisk = require('../api/data-risk/data-risk.route');

/**
 * Init server
 */
module.exports.initServer = () => {
    const app = express();

    // init express middleware
    // Set query string parser
    app.use(bodyParser.urlencoded({
        extended: true
    }));

    // Set json form parser
    app.use(bodyParser.json());

    // Set client static folders
    initClientStaticFolders(app);

    // Use helmet to secure Express headers
    app.use(helmet());

    // Set express logger (morgan)
    app.use(morgan(config.logger.morgen, { stream: logger.stream }));

    // Load api route
    app.use('/api', dataRisk);

    // Start the server
    return app;
};

/**
 * Set client static folders
 */
function initClientStaticFolders(app) {
    // Set static paths
    app.use(express.static(path.resolve('public')));
}
