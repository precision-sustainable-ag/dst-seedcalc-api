const {RenderableError} = require('./RenderableError')

class InternalServerError extends RenderableError {


    status(){
        return 500
    }
    
    content(){
        return "application/json"
    }
    
    description(){
        return "Internal Server Error";
    }

    schema(){
        return {
            type: 'object',
            properties: {
                key:{type:"string"},
                messages: {type:'array',items:{type:'string'}}
            }
        }
    }

    wrapper(){
        return {
            type:'object'
        };
    }

    build(data){
        return {
            type:'object'
        };
    }

}

module.exports =  {
    InternalServerError
}