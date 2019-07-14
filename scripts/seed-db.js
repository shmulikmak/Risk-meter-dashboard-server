const fs = require('fs');
const mongoose = require('../lib/mongoose');
const logger = require('../lib/logger');
const { RidkData } = require('../api/data-risk/data-risk.model');

const jsonFileName = 'data.json';

/**
 * parse file to db
 */
async function parseJsonFileToDb() {
    // delete collection
    await RidkData.deleteMany({});

    const jsonDataFile = JSON.parse(fs.readFileSync(`./scripts/${jsonFileName}`, 'utf8'));

    await RidkData.insertMany(jsonDataFile);
}

/**
 * init json parser script
 */
async function init() {
    try {
        // Connect to db
        await mongoose.connect();

        // import json file to mongo
        await parseJsonFileToDb();

        // Disconnect form mongo
        await mongoose.disconnect();
    } catch (error) {
        logger.error('Error in seed db', error);
    }
}

init();
