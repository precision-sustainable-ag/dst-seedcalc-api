
const { BadRequestError } = require('../errors/BadRequestError');
const { InternalServerError } = require('../errors/InternalServerError');
const { Resource } = require('./Resource');


class Collection extends Resource {


    status(){
        return 200
    }
    
    content(){
        return "application/json"
    }
    
    description(){
        return "Returns a collection of Objects";
    }

    schema(){
        return {}
    }

    wrapper(){
        const schema = this.schema();
        return {
            type:'object',
            properties:{
                type:{type:'string'},
                data: {
                    type: 'array',
                    items: schema
                },
            }
        }
    }

    meta(){
        return null;
    }

    build(res,req){
        return {type:'array',data:res.data};
    }

    errors(){
        return [
            BadRequestError,
            InternalServerError
        ];  
    }

    buildDocument() {
        const errors = this.errors();
        const document = super.buildDocument();
        for(let error of errors){
            const errDocument = error.document()
            if(errDocument?.responses) document.responses = {
                ...document.responses,
                ...errDocument.responses
            }
        }
        
        return document;
    }


}

module.exports = {
    Collection
}