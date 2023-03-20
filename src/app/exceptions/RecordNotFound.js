
const { RenderableException } = require('./RenderableException');

class RecordNotFound extends RenderableException {


    constructor({ data }){
        super();
        this.status = 404;
        this.body = {
            data,
            errors: {
                id: ['Record not found.']
            },
        };
    }

}

module.exports = {
    RecordNotFound
}