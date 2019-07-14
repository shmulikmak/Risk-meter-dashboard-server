
module.exports = {
    db: {
        mongo: {
            uri: process.env.MONGO_URI || 'mongodb://localhost:27017/risk-meter',
            options: {
                useNewUrlParser: true,
                useCreateIndex: true,
                config: {
                    autoIndex: true
                }
            },
            // Enable mongoose debug mode
            debug: process.env.MONGO_DEBUG ? (process.env.MONGO_DEBUG === 'true') : true
        }
    },
    logger: {
        debug: process.env.LOG_DEBUG ? (process.env.LOG_DEBUG === 'true') : true,
        morgen: 'dev'
    }
};
