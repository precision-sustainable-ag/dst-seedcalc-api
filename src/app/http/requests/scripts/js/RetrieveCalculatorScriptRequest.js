const { Request } = require("../../../../../framework/requests/Request");


class RetrieveCalculatorScriptRequest extends Request {
   
    authorized(){
        return false;
    }

    strict(){
        return true;
    }

    filtered(){
        return true;
    }
    
    /**
     * follow OpenAPI standards of parameter declaration
     * https://spec.openapis.org/oas/v3.0.0#parameter-object
     */
    parameters(){
        return [
            {in:'query',name:'pretty',schema:{type:'boolean'},required:false},
        ];
    }

    /**
     * follow OpenAPI 3.0.0 standards for schema declaration 
     * https://spec.openapis.org/oas/v3.0.0#schema-object
     */
    body(){
        return {};
    }

}

module.exports = { RetrieveCalculatorScriptRequest }