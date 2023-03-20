const {ModelsProvider} = require('./app/providers/ModelsProvider');
const {DatabaseProvider} = require('./app/providers/DatabaseProvider');
const {LoggingProvider} = require('./app/providers/LoggingProvider');
const {ValidatorProvider} = require('./app/providers/ValidatorProvider');
const {MiddlewareProvider} = require('./app/providers/MiddlewareProvider');
const {RoutesProvider} = require('./app/providers/RoutesProvider');
const { QueueProvider } = require('./app/providers/QueueProvider');
const { DatabaseListenersProvider } = require('./app/providers/DatabaseListenersProvider');
const queues = require('./config/queues');
const watching = require('./config/databaseListeners');
const { Provider } = require('./framework/providers/Provider');
const { DocsProvider } = require('./app/providers/DocsProvider');

const Providers = [
    LoggingProvider, //logging provider should be first so any other provider failures can be logged.
    DatabaseProvider, //!db provider must be registered before models provider.
    ValidatorProvider,
    {provider: ModelsProvider, params: [DatabaseProvider]},
    // {provider: QueueProvider, params: [queues]},
    // {provider: DatabaseListenersProvider, params: [DatabaseProvider,watching]},
];

async function RegisterProviders(app){
    for(let provider of Providers){
        let params = [app];
        let _provider;
        
        if(provider.prototype instanceof Provider) _provider = provider;
        else {
            _provider = provider.provider;
            params = params.concat(provider.params);
        }

        if(await _provider.register(...params) == false) return false;
    }
    return true;
}



async function bootstrap(app){
    if(await RegisterProviders(app) == false) return false;
    // first bootstrap global middleware
    await MiddlewareProvider.RegisterGlobalMiddleware(app);
    // third bootstrap routes
    await RoutesProvider.register(app);
    // generate and provide documentation
    await DocsProvider.register(app, RoutesProvider);
    // lastly bootstrap end of life cycle middleware
    await MiddlewareProvider.RegisterEndOfLifecycleMiddleware(app)

    return true;
}

module.exports = {
    bootstrap, RegisterProviders, Providers
}