---
to: src/app/http/resources/<%= h.inflection.pluralize(name) %>/Retrieve<%= h.inflection.singularize(Name) %>Resource.js
---


const { BadRequestError } = require('../../../../framework/errors/BadRequestError');
const { InternalServerError } = require('../../../../framework/errors/InternalServerError');
const { RecordNotFoundError } = require('../../../../framework/errors/RecordNotFoundError');
const { Resource } = require('../../../../framework/resources/Resource');

const { <%= h.inflection.singularize(Name) %> } = require('../../../models/<%= h.inflection.singularize(Name) %>');


const transform = (data) => {
    return data;
}

/**
* Sequelize models to include.
* Written in Sequelize syntax: https://sequelize.org/docs/v6/core-concepts/assocs/#basics-of-queries-involving-associations
*/
const includes = [

];

class Retrieve<%= h.inflection.singularize(Name) %>Resource extends Resource {

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
        // res.data = transform(res.data); // transform the data
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
    Retrieve<%= h.inflection.singularize(Name) %>Resource,
    includes,
}