
module.exports = {
    db: {
        mongo: {
            uri: process.env.MONGO_URI || 'mongodb://mongodb:27017/risk-meter',
            options: {
                useNewUrlParser: true,
                useCreateIndex: true,
                config: {
                    autoIndex: false
                }
            },
            // Enable mongoose debug mode
            debug: process.env.MONGO_DEBUG ? (process.env.MONGO_DEBUG === 'true') : false
        }
    },
    logger: {
        debug: process.env.LOG_DEBUG ? (process.env.LOG_DEBUG === 'true') : false,
        morgen: 'combined'
    }
};
