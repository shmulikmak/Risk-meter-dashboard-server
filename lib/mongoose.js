const mongoose = require('mongoose');
const { db } = require('../config/config');

/**
 * connect to mongo
 */
async function connect() {
    return mongoose.connect(db.mongo.uri, db.mongo.options)
        .then(conn => {
            // Set mongoose debug mode
            mongoose.set('debug', db.mongo.debug);

            // Set useCreateIndex
            mongoose.set('useCreateIndex', true);

            return conn;
        });
}

/**
 * Disconnect from mongo
 */
async function disconnect() {
    return mongoose.disconnect();
}

module.exports = {
    connect,
    disconnect
};
