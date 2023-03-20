const {env} = require('./kernel');

module.exports =  {
    algorithim: env.JWT_ALGORITHIM ?? 'RSA SHA256',
    key: env.JWT_KEY ?? '4nvvdDCK9zExLW2u7yJM93WxLjS4YQ2m', // 256-bit Encryption Key
    storagePath: 'storage/keys',
    lifetime: env.JWT_LIFETIME ?? '1h',
}