const CatchAll = require('../http/middleware/CatchAll');
const ErrorRenderer = require('../http/middleware/ErrorRenderer');
const OpenToken = require('../http/middleware/OpenToken');
const Cors = require('../http/middleware/Cors');


class MiddlewareProvider {

    static RegisterGlobalMiddleware(app){
        /**
         * please visit documentation for more information on cors package
         * https://www.npmjs.com/package/cors
         */
        app.use(Cors);
        // registeration order matters...
        app.use(OpenToken);
   
    }
    
    static RegisterEndOfLifecycleMiddleware(app){
        // this should be second to last
        app.use(CatchAll);
        // this should always be last.
        app.use(ErrorRenderer);
    }

}

module.exports = {
    MiddlewareProvider
}
