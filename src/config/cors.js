const {env} = require('./kernel');

/**
 * please visit documentation for more information on cors package
 * https://www.npmjs.com/package/cors
 */
module.exports =  {
    origin: env?.ALLOW_ORIGINS ? env.ALLOW_ORIGINS.split(',') : '*',
}