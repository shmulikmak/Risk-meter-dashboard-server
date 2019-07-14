// Load .env file to environment variables
require('dotenv').config();

const config = require('./config/config');
const { initServer } = require('./lib/express');
const mongoose = require('./lib/mongoose');
const logger = require('./lib/logger');

async function start() {
    try {
        // Connect to db
        await mongoose.connect();

        // Init server
        const app = initServer();

        app.listen(config.port, config.host, () => {
            logger.info(`
                ${config.app.title}
                Environment:     ${config.env}
                URL:             ${config.url}
                Database:        ${config.db.mongo.uri}
                `);
        });
    } catch (error) {
        logger.error('Faild to start the server', error);
    }
}

start();
