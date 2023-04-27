const { BadRequestError } = require('../../../../../framework/errors/BadRequestError');
const { InternalServerError } = require('../../../../../framework/errors/InternalServerError');
const { RecordNotFoundError } = require('../../../../../framework/errors/RecordNotFoundError');
const { Resource } = require('../../../../../framework/resources/Resource');



const transform = (data) => {
    return data;
}

/**
* Sequelize models to include.
* Written in Sequelize syntax: https://sequelize.org/docs/v6/core-concepts/assocs/#basics-of-queries-involving-associations
*/
const includes = [

];

class RetrieveCalculatorScriptResource extends Resource {

    /**
    * returns HTTP Status code for the error.
    * https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
    */
    status(){
        return 200
    }
    
    content(){
        return "text/javascript"
    }
    
    description(){
        return "Returns the Javascript SDK for the SeedRateCalculator";
    }

    /**
    * returns schema of data object 
    * written in OpenAPI schema structure
    * https://spec.openapis.org/oas/v3.0.0#schema-object
    */
    schema(){
        return {};
    }

    build(res,req){
        return res.data;
        // res.data = transform(res.data); // transform the data
        // return super.build(res,req);
    }

    errors(){
        return [
            BadRequestError,
            RecordNotFoundError,
            InternalServerError,
        ]
    }


}

module.exports = {
    RetrieveCalculatorScriptResource,
    includes,
}