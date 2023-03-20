
const app_conf = require('./config/app')
const { Log } = require('./app/providers/LoggingProvider')
const { AppProvider } = require("./app/providers/AppProvider");

AppProvider.factory().then(app => {
    if(app) app.listen(app_conf.port, () => {
        Log.Info({message:`${app_conf.name} listening on port ${app_conf.port}`, heading: 'Application Instantiated:'})
    });
});