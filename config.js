module.exports = {
	sessionSecret: 'your secret',
	port: 61340,
	uri: 'http://localhost:8080', // Without trailing /
    redis: {
        host: 'localhost',
        port: 6379
    },
    mongodb_production: 'mongodb://localhost/railway_production',
    mongodb_development: 'mongodb://localhost/railway_development',
    socketio: {
        level: 2
    },
	environment: (process.env.NODE_ENV !== 'production') ? 'development' : 'production',
	selenium : {
		testtimeout : 60000
	},
	sessionStore:'mongodb://localhost/sessionStore/session'
};
