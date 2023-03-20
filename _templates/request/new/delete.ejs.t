---
to: src/app/http/requests/<%= h.inflection.pluralize(name) %>/Delete<%= h.inflection.singularize(Name) %>Request.js
---

const {Request} = require('../../../../framework/requests/Request');


class Delete<%= h.inflection.singularize(Name) %>Request extends Request {
   
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
            {in:'path',name:'id',schema:{type:'integer'},required:true},
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

module.exports = { Delete<%= h.inflection.singularize(Name) %>Request }