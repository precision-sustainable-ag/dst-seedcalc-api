const {env} = require('./kernel');

module.exports = {
    openapi: "3.0.0",
    info: {
        title: env.APP_NAME,
        description: env.APP_DESCRIPTION ?? "",
        version: env.APP_VERSION ?? '1.0.0'
    },
    servers: [
        {url:`${env.APP_URL}${env.APP_ENV === 'local' ? `:${env.APP_PORT ?? 3000}` : ''}`, description: "local"},
        // {url:"https://developapi.covercrop-selector.org", description: "development"},
        // {url:"https://api.covercrop-selector.org", description: "production"},
    ],
    externalDocs:{
        description: "Database Diagram",
        url: "https://whimsical.com/species-selector-db-9JJrHXLxpYCVsszhrWyQRt@2Ux7TurymLha3TG8jkN7"
    },
    paths: {}
}