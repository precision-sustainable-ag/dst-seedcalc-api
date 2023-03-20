// const { ErrorDocument } = require("./ErrorDocument");
const {CLS:Response} = require('../responses/Response');

class RenderableError extends Response(Error) {

    constructor(errors){
        super();
        this.errors = errors;
    }

    render(res){
        const data = this.build(res);
        const status = this.status();
        const content = this.content();
        return res.status(status).type(content).send(data);
    }

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
        return {}
    }

    wrapper(){
        const schema = this.schema();
        const meta = this.meta();
        const wrapper = {
            type:'object',
            properties:{
                type:{type:'string'},
                errors: schema
            }
        }
        if(meta?.type) wrapper.meta = meta;
        return wrapper;
    }

    meta(){
        return null;
    }

    build(data){
        return {};
    }

}

module.exports =  {
    RenderableError
}