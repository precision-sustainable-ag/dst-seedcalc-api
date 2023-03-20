
const { RenderableException } = require('./RenderableException');

class UnAuthorized extends RenderableException {

    constructor(){
        super();
        this.status = 401;
        this.body = {
            errors: ['Invalid Authorization.']
        };
    }

}

module.exports =  {
    UnAuthorized
}