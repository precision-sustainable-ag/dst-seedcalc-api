---
to: src/app/errors/<%= Name %>Error.js
---

const { RenderableError } = require('../../framework/errors/RenderableError');


class <%= Name %>Error extends RenderableError {

    constructor(errors){
        super();
        this.errors = errors;
    }

    /**
    * returns HTTP Status code for the error.
    * https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
    */
    status(){
        return 500
    }
    
    content(){
        return "application/json"
    }
    
    description(){
        return "<%= Name %> Error";
    }

    /**
    * This returns the schema of the errors object
    * written in OpenAPI schema sytax
    * https://spec.openapis.org/oas/v3.0.0#schema-object
    */
    schema(){
        return {}
    }

    /**
    * THIS FUNCTION SHOULD RETURN THE SCHEMA FOR THE FULL RENDERED OBJECT
    * This returns the schema of the rendered object.
    * written in OpenAPI schema sytax
    * https://spec.openapis.org/oas/v3.0.0#schema-object
    */
    wrapper(){ 
        const schema = this.schema();
        return {
            type:'object',
            properties:{
                type: {type:'string'},
                errors: schema,
            }
        };
    }

    /**
    * This builds the the data object that will be rendered.
    */
    build(){
        return this.errors;
    }

    /**
    * This handles rendering the response into an HTTP response
    */
    render(res){
        return super.render(res);
    }



}

module.exports =  {
    <%= Name %>Error
}
