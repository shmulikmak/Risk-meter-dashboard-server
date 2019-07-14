

const config = {
    app: {
        title: 'risk meter dashboard',
        description: 'risk meter dashboard description'
    },
    env: process.env.NODE_ENV || 'development',
    isProd: process.env.NODE_ENV === 'production',
    port: parseInt(process.env.PORT || '8080'),
    host: process.env.HOST || '0.0.0.0',
    url: process.env.URL
};

// Set app url
config.url = config.url || `http://${config.host === '0.0.0.0' ? 'localhost' : config.host}:${config.port}`;

module.exports = config;
