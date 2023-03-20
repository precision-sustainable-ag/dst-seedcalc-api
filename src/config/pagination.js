const {env} = require('./kernel');

module.exports = {
    default: {
        page: 1,
        limit: env.PAGINATION_DEFAULT_LIMIT ?? 200,
        maxLimit: env.PAGINATION_DEFAULT_MAX_LIMIT ?? 500,
    }
}