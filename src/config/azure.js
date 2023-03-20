const {env} = require('./kernel');

module.exports =  {
    blob: {
        account: env.AZURE_BLOB_ACCOUNT,
        container: env.AZURE_BLOB_CONTAINER,
        connection: env.AZURE_BLOB_CONNECTION_STRING,
    }
}