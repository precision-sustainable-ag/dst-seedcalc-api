const { CLS:StaticDocument } = require("../documents/StaticDocument");

const CLS = (E) => class extends StaticDocument(E) { 

    static [Symbol.hasInstance](obj) {
        if (obj.render && typeof obj.render == 'function') return true;
    }

    static render(){
        const instance = new this();
        const status = instance.status();
        const content = instance.content();
        return async (req, res) => {
            const data = await instance.build(res,req);
            res.status(status).type(content).send(data);
        }
    }

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

    wrapper(){
        const schema = this.schema();
        return {
            type:'object',
            properties:{
                type:{type:'string'},
                data: schema,
            }
        }
    }

    meta(){
        return null;
    }

    build(data){
        return data;
    }

    getSchema(){
        const meta = this.meta();
        const wrapper = this.wrapper();
        if(meta?.type) wrapper.meta = meta;
        return wrapper;
    }



    buildDocument() {
        const status = this.status();
        const description = this.description();
        const contentType = this.content();
        const schema = this.getSchema();
        return {
            responses: {
                [status] : {
                    description,
                    content: {
                        [contentType]: {
                            schema,
                        }
                    }
                }
            }
        }
    }

}

const Response = CLS(Object);

module.exports = { Response, CLS }