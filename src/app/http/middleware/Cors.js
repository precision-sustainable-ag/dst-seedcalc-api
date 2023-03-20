const cors_conf = require('../../../config/cors');
const cors = require('cors');

/**
 * please visit documentation for more information on cors package
 * https://www.npmjs.com/package/cors
 */
module.exports = cors(cors_conf)