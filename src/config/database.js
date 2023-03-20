const {env} = require('./kernel');

module.exports =  {
    connection: env.DB_CONNECTION,
    dialect:    env.DB_CONNECTION,
    host:       env.DB_HOST,
    port:       env.DB_PORT,
    username:   env.DB_USERNAME,
    password:   env.DB_PASSWORD,
    database:   env.DB_DATABASE,
    ssl:        env?.DB_SSL ? env.DB_SSL : 'true',
    logging:    env.DB_LOGGING == 'true' ? console.log : false, //!!must be either console.log or false.
    dialectOptions: env?.DB_SSL == 'true' ? {
        ssl: {
          require: true, // This will help you. But you will see nwe error
          rejectUnauthorized: false // This line will fix new error
        }
    } : {}
}