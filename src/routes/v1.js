const { Route } = require("../framework/routing/Route");
const { Router } = require("../framework/routing/Router");
const Public = require('../app/http/middleware/Public');
const { RetrieveCalculatorScriptRequest } = require("../app/http/requests/scripts/js/RetrieveCalculatorScriptRequest");
const { ScriptsController } = require("../app/http/controllers/ScriptsController");
const { RetrieveCalculatorScriptResource } = require("../app/http/resources/scripts/js/RetrieveCalculatorScriptResource");

module.exports = Router.expose({path:'/v1', routes: [

    Route.get({path:'/scripts/js/sdk.js', summary: 'Returns the Javascript SDK for the SeedRateCalculator',
        request: RetrieveCalculatorScriptRequest,
        handler: ScriptsController.factory().calculator,
        response: RetrieveCalculatorScriptResource
    }).middleware([Public]),


]});
