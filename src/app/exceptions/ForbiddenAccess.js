
const { RenderableException } = require('./RenderableException');

class ForbiddenAccess extends RenderableException {

    constructor(){
        super();
        this.status = 403;
        this.body = {
            errors: ['Forbidden Access Attempt']
        };
    }

}

module.exports =  {
    ForbiddenAccess
}