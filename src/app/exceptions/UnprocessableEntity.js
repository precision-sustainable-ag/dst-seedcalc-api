
const { RenderableException } = require('./RenderableException');

class UnprocessableEntity extends RenderableException {


    constructor({ data, errors }){
        super();
        this.status = 422;
        this.body = {
            data,
            errors
        };
    }

}

module.exports = {
    UnprocessableEntity
}