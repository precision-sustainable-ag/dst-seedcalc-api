const { UnAuthorized } = require('../../app/exceptions/UnAuthorized');


class Controller {

    static factory(){
        const _instance = new this();

        for ( let propName of Object.getOwnPropertyNames(this.prototype)) {

            if(propName != 'constructor') {
                const prop = _instance[propName];
                _instance[propName] = Controller.wrap(prop)
            }
        }

        return _instance;
    }

    static wrap(method){

        return  async (req, res, next) => {
            try{

                if(!req.authorized) throw new UnAuthorized();
                
                const result = await method({req, params:req.validated.params, payload:req.validated.body})

                res.data = result?.data ? result.data : result;
                res.count = result?.count;

                next();

            } catch(err){
                console.log(err);
                next(err);
            }
        }
    }

}

module.exports = {
    Controller
}