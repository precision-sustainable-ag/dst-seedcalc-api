---
to: src/routes/<%= h.inflection.pluralize(name) %>.js
---

const { <%= h.inflection.pluralize(Name) %>Controller } = require("../app/http/controllers/<%= h.inflection.pluralize(Name) %>Controller");
const { Create<%= h.inflection.singularize(Name) %>Request } = require("../app/http/requests/<%= h.inflection.pluralize(name) %>/Create<%= h.inflection.singularize(Name) %>Request");
const { List<%= h.inflection.pluralize(Name) %>Request } = require("../app/http/requests/<%= h.inflection.pluralize(name) %>/List<%= h.inflection.pluralize(Name) %>Request");
const { Retrieve<%= h.inflection.singularize(Name) %>Request } = require("../app/http/requests/<%= h.inflection.pluralize(name) %>/Retrieve<%= h.inflection.singularize(Name) %>Request");
const { Update<%= h.inflection.singularize(Name) %>Request } = require("../app/http/requests/<%= h.inflection.pluralize(name) %>/Update<%= h.inflection.singularize(Name) %>Request");
const { Delete<%= h.inflection.singularize(Name) %>Request } = require("../app/http/requests/<%= h.inflection.pluralize(name) %>/Delete<%= h.inflection.singularize(Name) %>Request");
const { Create<%= h.inflection.singularize(Name) %>Resource } = require("../app/http/resources/<%= h.inflection.pluralize(name) %>/Create<%= h.inflection.singularize(Name) %>Resource");
const { List<%= h.inflection.pluralize(Name) %>Resource } = require("../app/http/resources/<%= h.inflection.pluralize(name) %>/List<%= h.inflection.pluralize(Name) %>Resource");
const { Retrieve<%= h.inflection.singularize(Name) %>Resource } = require("../app/http/resources/<%= h.inflection.pluralize(name) %>/Retrieve<%= h.inflection.singularize(Name) %>Resource");
const { Update<%= h.inflection.singularize(Name) %>Resource } = require("../app/http/resources/<%= h.inflection.pluralize(name) %>/Update<%= h.inflection.singularize(Name) %>Resource");
const { Delete<%= h.inflection.singularize(Name) %>Resource } = require("../app/http/resources/<%= h.inflection.pluralize(name) %>/Delete<%= h.inflection.singularize(Name) %>Resource");
const { Route } = require("../framework/routing/Route");
const { Router } = require("../framework/routing/Router");
const Public = require('../app/http/middleware/Public');

module.exports = Router.expose({path:'/<%= h.inflection.pluralize(name) %>', routes: [

    Route.post({path:'/', summary:"Create a <%= h.inflection.singularize(Name) %> Object",
        request: Create<%= h.inflection.singularize(Name) %>Request,
        handler:<%= h.inflection.pluralize(Name) %>Controller.factory().create,
        response: Create<%= h.inflection.singularize(Name) %>Resource
    }).middleware([Public]),

    Route.get({path:'/', summary:"Get List of <%= h.inflection.pluralize(Name) %> Objects",
        request: List<%= h.inflection.pluralize(Name) %>Request,
        handler:<%= h.inflection.pluralize(Name) %>Controller.factory().list,
        response: List<%= h.inflection.pluralize(Name) %>Resource
    }).middleware([Public]),

    Route.get({path:'/{id}', summary:"Retrieve a <%= h.inflection.singularize(Name) %> Object",
        request: Retrieve<%= h.inflection.singularize(Name) %>Request,
        handler: <%= h.inflection.pluralize(Name) %>Controller.factory().retrieve,
        response: Retrieve<%= h.inflection.singularize(Name) %>Resource
    }).middleware([Public]),

    Route.put({path:'/{id}', summary:"Update a <%= h.inflection.singularize(Name) %> Object",
        request: Update<%= h.inflection.singularize(Name) %>Request,
        handler:<%= h.inflection.pluralize(Name) %>Controller.factory().update,
        response: Update<%= h.inflection.singularize(Name) %>Resource
    }).middleware([Public]),

    Route.delete({path:'/{id}', summary:"Delete a <%= h.inflection.singularize(Name) %> Object",
        request: Delete<%= h.inflection.singularize(Name) %>Request,
        handler:<%= h.inflection.pluralize(Name) %>Controller.factory().delete,
        response: Delete<%= h.inflection.singularize(Name) %>Resource
    }).middleware([Public]),

]});
