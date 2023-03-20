const {env} = require('./kernel');

module.exports =  {
    port: env.REDIS_PORT ?? 6379,
    host: env.REDIS_HOST ?? 'localhost',
    password: env.REDIS_PASSWORD ?? '',
}