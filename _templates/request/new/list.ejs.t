---
to: src/app/http/requests/<%= h.inflection.pluralize(name) %>/List<%= h.inflection.pluralize(Name) %>Request.js
---

const { PaginatedRequest } = require('../../../../framework/requests/PaginatedRequest');


class List<%= h.inflection.pluralize(Name) %>Request extends PaginatedRequest {
   
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
            ...super.parameters(), // provides pagination parameters
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

module.exports = { List<%= h.inflection.pluralize(Name) %>Request }