---
to: src/app/http/resources/<%= h.inflection.pluralize(name) %>/List<%= h.inflection.pluralize(Name) %>Resource.js
---

const { BadRequestError } = require('../../../../framework/errors/BadRequestError');
const { InternalServerError } = require('../../../../framework/errors/InternalServerError');
const { Collection } = require('../../../../framework/resources/Collection');
const { PaginatedCollection } = require('../../../../framework/resources/PaginatedCollection');
const { <%= h.inflection.singularize(Name) %> } = require('../../../models/<%= h.inflection.singularize(Name) %>');


const transform = (record) => {
    return record;
}

/**
* Sequelize models to include.
* Written in Sequelize syntax: https://sequelize.org/docs/v6/core-concepts/assocs/#basics-of-queries-involving-associations
*/
const includes = [
    
];

class List<%= h.inflection.pluralize(Name) %>Resource extends PaginatedCollection {

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
        return "Returns a list of <%= h.inflection.singularize(Name) %> Objects";
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
        // res.data = res.data.map(crop => transform(crop)); // transforms each object in list.
        return super.build(res,req);
    }

    errors(){
        return [
            BadRequestError,
            InternalServerError,
        ]
    }


}

module.exports = {
    List<%= h.inflection.pluralize(Name) %>Resource, includes
}