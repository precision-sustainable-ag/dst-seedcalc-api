const {RenderableError} = require('./RenderableError');

class RecordNotFoundError extends RenderableError {

    constructor(data, messages){
        super();
        this.data = data;
        this.messages = messages;
    }

    status(){
        return 404
    }
    
    content(){
        return "application/json"
    }
    
    description(){
        return "Record Not Found";
    }

    schema(){
        return {
            type: 'object',
            properties: {
                type:{type:'string'},
                recieved: { type:'object' },
                messages: { type: 'array', items:{type:'string'}}
            }
        }
    }

    wrapper(){
        return this.schema();
    }

    build(){
        const data = this.data;
        const messages = this.messages;
        return {
            type:'array',
            recieved:data,
            messages
        };
    }

}

module.exports =  {
    RecordNotFoundError
}