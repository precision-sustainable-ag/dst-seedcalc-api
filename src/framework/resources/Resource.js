
const { BadRequestError } = require('../errors/BadRequestError');
const { UnprocessibleEntityError } = require('../errors/UnprocessibleEntityError');
const { InternalServerError } = require('../errors/InternalServerError');
const {Response} = require('../responses/Response');


class Resource extends Response {


    status(){
        return 200
    }
    
    content(){
        return "application/json"
    }
    
    description(){
        return "";
    }

    schema(){
        return {}
    }

    build(res,req){
        return {type:'object',data:res.data};
    }

    errors(){
        return [
            UnprocessibleEntityError,
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
    Resource
}