---
to: src/app/http/resources/<%= h.inflection.pluralize(name) %>/Delete<%= h.inflection.singularize(Name) %>Resource.js
---


const { BadRequestError } = require('../../../../framework/errors/BadRequestError');
const { InternalServerError } = require('../../../../framework/errors/InternalServerError');
const { RecordNotFoundError } = require('../../../../framework/errors/RecordNotFoundError');
const { Retrieve<%= h.inflection.singularize(Name) %>Resource } = require('./Retrieve<%= h.inflection.singularize(Name) %>Resource');

const { <%= h.inflection.singularize(Name) %> } = require('../../../models/<%= h.inflection.singularize(Name) %>');


class Delete<%= h.inflection.singularize(Name) %>Resource extends Retrieve<%= h.inflection.singularize(Name) %>Resource {

    /**
    * returns HTTP Status code for the error.
    * https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
    */
    status(){
        return 200
    }
    
    content(){
        return "application/json"
    }
    
    description(){
        return "Returns a <%= h.inflection.singularize(Name) %> Object";
    }
    
    /**
    * returns schema of data object 
    * written in OpenAPI schema structure
    * https://spec.openapis.org/oas/v3.0.0#schema-object
    */
    schema(){
        return <%= h.inflection.singularize(Name) %>.schema({});
    }

    build(res,req){
        return super.build(res,req);
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
    Delete<%= h.inflection.singularize(Name) %>Resource
}